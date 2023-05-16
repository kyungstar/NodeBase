import {getConnection} from "typeorm";


class ConnChecker {

    public async release(res: any, objData: any, needArr: string[]) {

        const queryRunner = getConnection().createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            await queryRunner.commitTransaction();
            return;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }

    }

}