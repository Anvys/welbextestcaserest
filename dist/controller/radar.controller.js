"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarController = exports.sendError = exports.getExprResult = void 0;
const index_1 = require("../index");
const StatusCodes_1 = require("../utils/StatusCodes");
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
exports.RadarController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { date, name, count, range } = req.body;
            console.log(`POST radar: `, date, name, count, range);
            const data = yield index_1.db.query(`INSERT INTO radar (date, name, count, range) values ($1, $2, $3, $4) RETURNING *`, [date, name, count, range]);
            res.json({
                msg: [],
                status: StatusCodes_1.StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            });
        }
        catch (e) {
            (0, exports.sendError)(e, res);
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield index_1.db.query(`SELECT * FROM radar`);
            console.log(`Get all radar ${data.rows.length}`);
            res.json({
                msg: [],
                status: StatusCodes_1.StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            });
        }
        catch (e) {
            (0, exports.sendError)(e, res);
        }
    }),
    getAllWithPagination: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(`Get with filters`);
            console.log(req.query);
            const page = req.query.page || 1; //default page = 1
            const count = Number(req.query.count) || 10; //default row on page = 10
            const queryFilter = req.query.filterType;
            const filterType = queryFilter === undefined || queryFilter === 'date' ? undefined : queryFilter;
            const searchStr = req.query.searchStr || '';
            const expr = Number(req.query.expr) || StatusCodes_1.exprCodes.include;
            const startIndex = count * (page - 1);
            // Запрашиваю все строки, потом фильтрую. Исхожу из того что это тестовое задание и строк должно быть не много
            //  поэтому не буду усложнять запросы и сделаю максимально просто бэк.
            const data = yield index_1.db.query(`SELECT * FROM radar ORDER BY id ASC`);
            // if filter not undefined do filter
            if (!!filterType && searchStr.trim().length > 0) {
                // console.log(`1 len=${data.rows.length}`)
                // console.log(`page:${page},count:${count},filterType:${filterType},searchStr:${searchStr},expr:${expr},startIndex:${startIndex}`)
                const filteredRows = data.rows
                    // search string filter
                    .filter(v => (0, exports.getExprResult)(filterType, v[filterType], searchStr, expr))
                    //paginator filter
                    .filter((v, i) => i >= startIndex && i < (startIndex + count));
                console.log(filteredRows.length);
                res.json({
                    msg: [],
                    status: StatusCodes_1.StatusCodes.Ok,
                    data: {
                        total: filteredRows.length,
                        rows: filteredRows
                    }
                });
            }
            else { // else response just pagination
                // console.log(`2 len=${data.rows.length}`)
                // console.log(page, count, filterType, searchStr, expr, startIndex)
                //paginator filter
                const filteredRows = data.rows
                    .filter((v, i) => i >= startIndex && i < (startIndex + count));
                res.json({
                    msg: [],
                    status: StatusCodes_1.StatusCodes.Ok,
                    data: {
                        total: data.rows.length,
                        rows: filteredRows
                    }
                });
            }
        }
        catch (e) {
            (0, exports.sendError)(e, res);
        }
    }),
    get: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const data = yield index_1.db.query(`SELECT * FROM radar WHERE id = $1`, [id]);
            console.log(`Get one id=${id}/ ${data.rows[0]}`);
            res.json({
                msg: [],
                status: StatusCodes_1.StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            });
        }
        catch (e) {
            (0, exports.sendError)(e, res);
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { date, name, count, range } = req.body;
            const id = req.params.id;
            console.log(`PUT radar id=${id}: `, date, name, count, range);
            const data = yield index_1.db.query(`UPDATE radar set date = $1 name = $2 count = $3 range = $4 WHERE id = $5 RETURNING *`, [date, name, count, range, id]);
            res.json({
                msg: [],
                status: StatusCodes_1.StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            });
        }
        catch (e) {
            (0, exports.sendError)(e, res);
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const data = yield index_1.db.query(`DELETE FROM radar WHERE id = $1`, [id]);
            console.log(`DELETE one id=${id}/ ${data.rows[0]}`);
            res.json({
                msg: [],
                status: StatusCodes_1.StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            });
        }
        catch (e) {
            (0, exports.sendError)(e, res);
        }
    }),
};
