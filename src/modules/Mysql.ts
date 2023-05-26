/**
 * Created by 유희찬 on 2023-05-26.
 */

import mariadb from "mariadb";
import Logger from '../modules/Logger'

class MariaDB {

    private cluster: any;

    constructor() {
        this.cluster = mariadb.createPoolCluster({removeNodeErrorCount: 5, restoreNodeTimeout: 5000});
    }


    public getCluster() {
        return this.cluster;
    };

    async getConnection() {
        try {
            const connection = await this.cluster.getConnection();
            return connection;
        } catch (err) {
            Logger.debug(err + ' is Occured');
            throw err; // 오류를 다시 호출한 쪽으로 전달
        }
    }

    async getOne(statement: string) {
        let conn = await this.getConnection();

        try {
            let result = await conn.query(statement.trim());

            Logger.debug("Query result - " + (!!result));
            Logger.debug(statement);

            await conn.commit();
            await conn.release();

            return result[0];

        } catch (err) {
            Logger.debug('Query Select Fail', err);
            await conn.release();
            return null;

        }

    }


    async get(statement: string[]) {

        let conn = await this.getConnection();

        try {
            await conn.beginTransaction();

            let query = statement.join(" ; ");
            let result = await conn.query(query);

            if (result.length !== statement.length) {
                throw new Error("Miss match query count! - Injection attack warning");
            }

            Logger.debug("Query result - " + (!!result));
            Logger.debug(query);

            await conn.commit();
            await conn.release();

            return result;

        } catch (err) {
            await conn.rollback();
            await conn.release();
            Logger.debug('Query Execute Fail', err);
        }
    }

    async Executer(statement: string) {
        let conn = await this.getConnection();

        try {

            let result = await conn.query(statement.trim());

            await conn.commit();
            await conn.release();

            Logger.debug("Query result - " + (!!result));
            Logger.debug(statement);

            return result.affectedRows;

        } catch (err) {
            await conn.rollback();
            await conn.release();

            Logger.error(err);
            return null;

        }

    }

    async getInsertId(statement: string) {
        let conn = await this.getConnection();

        try {

            let result = await conn.query(statement.trim());

            await conn.commit();
            await conn.release();

            Logger.debug("Query result - " + (!!result));
            Logger.debug(statement);

            return result.insertId;

        } catch (err) {
            await conn.rollback();
            await conn.release();
            return null;

        }

    }


}

export default new MariaDB();
