"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.getExprResult = void 0;
const StatusCodes_1 = require("./StatusCodes");
const getExprResult = (type, str, search, expr) => {
    switch (type) {
        case "name":
            switch (expr) {
                case StatusCodes_1.exprCodes.equal:
                    // console.log(`${String(str).trim()} / ${search}`)
                    return String(str).trim().toUpperCase() === String(search).trim().toUpperCase();
                case StatusCodes_1.exprCodes.less:
                case StatusCodes_1.exprCodes.more:
                case StatusCodes_1.exprCodes.include:
                    return String(str).includes(search);
                default:
                    return false;
            }
        case "count":
        case "range":
            switch (expr) {
                case StatusCodes_1.exprCodes.equal:
                    return Number(str) === Number(search);
                case StatusCodes_1.exprCodes.less:
                    return Number(str) < Number(search);
                case StatusCodes_1.exprCodes.more:
                    return Number(str) > Number(search);
                case StatusCodes_1.exprCodes.include:
                    return String(str).includes(search);
                default:
                    return false;
            }
    }
};
exports.getExprResult = getExprResult;
const sendError = (e, res) => {
    let msg = '';
    if (typeof e === "string") {
        msg = e.toUpperCase(); // works, `e` narrowed to string
    }
    else if (e instanceof Error) {
        msg = e.message; // works, `e` narrowed to Error
    }
    res.json({
        msg: [`${msg}`],
        status: StatusCodes_1.StatusCodes.badRequest,
        data: null
    });
};
exports.sendError = sendError;
