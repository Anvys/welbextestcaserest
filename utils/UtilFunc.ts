import {TFilterTypes, TResponse} from "./CommonTypes";
import {exprCodes, StatusCodes} from "./StatusCodes";

export const getExprResult = (type: TFilterTypes, str: string | number, search: string, expr: exprCodes): boolean => {
    switch (type) {
        case "name":
            switch (expr) {
                case exprCodes.equal:
                    // console.log(`${String(str).trim()} / ${search}`)
                    return String(str).trim().toUpperCase() === String(search).trim().toUpperCase()
                case exprCodes.less:
                case exprCodes.more:
                case exprCodes.include:
                    return String(str).includes(search)
                default:
                    return false
            }
        case "count":
        case "range":
            switch (expr) {
                case exprCodes.equal:
                    return Number(str) === Number(search)
                case exprCodes.less:
                    return Number(str) < Number(search)
                case exprCodes.more:
                    return Number(str) > Number(search)
                case exprCodes.include:
                    return String(str).includes(search)
                default:
                    return false
            }
    }

}
export const sendError = (e: any, res: TResponse) => {
    let msg = ''
    if (typeof e === "string") {
        msg = e.toUpperCase() // works, `e` narrowed to string
    } else if (e instanceof Error) {
        msg = e.message // works, `e` narrowed to Error
    }
    res.json({
        msg: [`${msg}`],
        status: StatusCodes.badRequest,
        data: null
    })
}