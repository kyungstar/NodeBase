import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import Config from "../../config";


export class JwtModel {

    u: string;
    t: string;

    constructor(obj: JwtModel);
    constructor(obj: any){
        this.u = obj.u;
        this.t = obj.t;
    }

    public getAll() {
        return {u: this.u, t: this.t};
    }

    public deliverReqData(req: Request) {
        req.body.userId = this.u;
        req.body.userType = this.t;
        return;
    }

}

export function createToken(input: JwtModel) {
    return jwt.sign(input.getAll(), Config.JWT.SECRET, {
        expiresIn: Config.JWT.EXPIRES_IN
    });

}

export function jwtAuthCheck(req: Request, res: Response, next: NextFunction) {

    let token = <string>req.headers["authorization"];

    if (!token)
        return res.status(401).send({result: false, code: "401"});

    if (token.indexOf("Bearer ", 0) < 0)
        return res.status(401).send({result: false, code: "401 Bearer"});

    token = token.slice(7, token.length);

    let jwtPayload;

    try {
        jwtPayload = new JwtModel(<JwtModel>jwt.verify(token, Config.JWT.SECRET));
        res.locals.jwtPayload = jwtPayload;

    } catch (err) {
        return res.status(401).send({result: false, code: "401", err: 'JWT Auth Error'});

    }

    jwtPayload.deliverReqData(req);
    let newToken = createToken(jwtPayload);
    res.setHeader("token", newToken);

    next();
}




