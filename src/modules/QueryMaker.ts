/**
 * Created By KYG On 2022-11-27
 */

import Logger from '../modules/Logger'
import ResController from "../routers/controller/ResController";

const escape = require('sqlstring').escape;

class QueryMaker extends ResController{

    Insert = (tblName: string, insertObj: any) => {

        try {

            let query =
                " INSERT INTO " + tblName +
                " SET ";

            for (let k in insertObj) {
                try {
                    if (insertObj[k][0] === '\\')
                        query += k + " = " + insertObj[k].slice(1, insertObj[k].length) + ',';
                    else
                        query += k + " = " + escape(insertObj[k]) + ',';

                } catch (err) {
                    query += k + " = " + escape(insertObj[k]) + ',';

                }
            }

            query = query.slice(0, -1);

            return query;

        } catch (err) {
            Logger.debug('Query Insert Fail')
        }

    }

    Select = (tblName: string, selectObj: any, selectList: string[]) => {

        try {

            let query =
                " SELECT ";

            for (let item of selectList) {
                query += item + ','
            }

            query = query.slice(0, -1);

            query += " " +
                "   FROM " + tblName +
                "   WHERE ";

            for (let k in selectObj) {
                try {
                    if (selectObj[k][0] === '\\')
                        query += k + " = " + selectObj[k].slice(1, selectObj[k].length) + 'AND';
                    else
                        query += k + " = " + escape(selectObj[k]) + 'AND';

                } catch (err) {
                    query += k + " = " + escape(selectObj[k]) + 'AND';

                }
            }

            query = query.slice(0, -3);

            return query;

        } catch (err) {
            Logger.debug('Query Select Fail')
        }

    }

    Delete = (tblName: string, targetObj: any) => {

        try {

            let query =
                "   DELETE" +
                "   FROM " + tblName;

            query += " " +
                "   WHERE ";

            for (let k in targetObj) {
                try {
                    if (targetObj[k][0] === '\\')
                        query += k + " = " + targetObj[k].slice(1, targetObj[k].length) + 'AND';
                    else
                        query += k + " = " + escape(targetObj[k]) + 'AND';

                } catch (err) {
                    query += k + " = " + escape(targetObj[k]) + 'AND';

                }
            }

            query = query.slice(0, -3);

            return query;

        } catch (err) {
            Logger.debug('Query Select Fail')
        }

    }



    Update = (tblName: string, updateObj: any, targetObj: any) => {

        try {

            let query =
                "   UPDATE " + tblName +
                "   SET ";

            for (let k in updateObj) {
                try {
                    if (updateObj[k][0] === '\\')
                        query += k + " = " + updateObj[k].slice(1, updateObj[k].length) + ',';
                    else
                        query += k + " = " + escape(updateObj[k]) + ',';

                } catch (err) {
                    query += k + " = " + escape(updateObj[k]) + ',';

                }
            }

            query = query.slice(0, -1);

            query += "   WHERE ";

            for (let k in targetObj) {
                try {
                    if (targetObj[k][0] === '\\')
                        query += k + " = " + targetObj[k].slice(1, targetObj[k].length) + 'AND';
                    else
                        query += k + " = " + escape(targetObj[k]) + 'AND';

                } catch (err) {
                    query += k + " = " + escape(targetObj[k]) + 'AND';

                }
            }

            query = query.slice(0, -3);

            return query;

        } catch (err) {
            Logger.debug('Query Select Fail')
        }

    }

}

export default new QueryMaker();