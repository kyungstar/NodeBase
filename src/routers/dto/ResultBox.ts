import {token} from "morgan";


export default class ResultBox {

    static ValueDto(result: boolean, dataObj: Object) {

        console.log(dataObj, 'dataObj');
        return {result, dataObj};
    }


    static JustBoolean(result: boolean) {
        return {result: result, code: 'SUC01'};
    }



}