import {Router} from "express";

import Config from '../../../config'
import apiUSER from '../../routers/controller/User/index'

const router = Router();


if (Config.SERVER_TYPE === "USER") {
    router.use("/api", apiUSER);
}

if (Config.SERVER_TYPE === "TOUR") {
    router.use("/api/tour", apiUSER);
}

export default router;
