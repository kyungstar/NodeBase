import {Router} from "express";

import Config from '../../../config'
import apiUSER from '../../routers/controller/User/index'

const router = Router();


if (Config.SERVER_TYPE === "USER") {
    router.use("/api", apiUSER);
}

export default router;
