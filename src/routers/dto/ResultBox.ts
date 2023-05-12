import {token} from "morgan";


export default class ResultBox {

    static JustPropertyValue(result: boolean, property: any) {
        return {result, property};
    }


    static JustFalse(code: string) {
        return {result: false, code: code};
    }

    static JustTrue(code: string) {
        return {result: true, code: code};
    }

    static JustErr(err: string) {

        err = err.substring(0, 10);

        return {result: false, code: '03', err: err + ' Is Occurred'};
    }



}