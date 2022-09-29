import {db} from "../index";
import {exprCodes, StatusCodes} from "../utils/StatusCodes";
import {
    TFilterTypes,
    TQueryResultRadar,
    TRequest,
    TRequestPagination,
    TRequestWithId,
    TResponse
} from "../utils/CommonTypes";
import {getExprResult, sendError} from "../utils/UtilFunc";


export const RadarController = {
    create: async (req: TRequest, res: TResponse) => {
        try {
            const {date, name, count, range} = req.body.data
            console.log(`POST radar: `, date, name, count, range)
            const data = await db.query<TQueryResultRadar>(
                `INSERT INTO radar (date, name, count, range) values ($1, $2, $3, $4) RETURNING *`,
                [date, name, count, range])
            res.json({
                msg: [],
                status: StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            })
        } catch (e) {
            sendError(e, res);
        }
    },
    getAll: async (req: TRequest, res: TResponse) => {
        try {
            const data = await db.query(`SELECT * FROM radar`)
            console.log(`Get all radar ${data.rows.length}`)
            res.json({
                msg: [],
                status: StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            })
        } catch (e) {
            sendError(e, res);
        }
    },
    getAllWithPagination: async (req: TRequestPagination, res: TResponse) => {
        try {
            console.log(`Get with filters`, req.query)
            const page = req.query.page || 1 //default page = 1
            const count = Number(req.query.count) || 10 //default row on page = 10
            const queryFilter = req.query.filterType
            const filterType: TFilterTypes | undefined = queryFilter === undefined || queryFilter === 'date' ? undefined : queryFilter
            const searchStr = req.query.searchStr || ''
            const expr = Number(req.query.expr) || exprCodes.include
            const startIndex = count * (page - 1)
            // Запрашиваю все строки, потом фильтрую. Исхожу из того что это тестовое задание и строк должно быть не много
            //  поэтому не буду усложнять запросы и сделаю максимально просто бэк.
            const data = await db.query<TQueryResultRadar>(`SELECT * FROM radar ORDER BY id ASC`)
            // if filter not undefined do filter
            if (!!filterType && searchStr.trim().length > 0) {
                const filteredRows = data.rows
                    // search string filter
                    .filter(v => getExprResult(filterType, v[filterType], searchStr, expr as exprCodes))
                    //paginator filter
                    .filter((v, i) => i >= startIndex && i < (startIndex + count))
                console.log(filteredRows.length)
                res.json({
                    msg: [],
                    status: StatusCodes.Ok,
                    data: {
                        total: filteredRows.length,
                        rows: filteredRows
                    }
                })
            } else {// else response just pagination
                //paginator filter
                const filteredRows = data.rows
                    .filter((v, i) => i >= startIndex && i < (startIndex + count))
                res.json({
                    msg: [],
                    status: StatusCodes.Ok,
                    data: {
                        total: data.rows.length,
                        rows: filteredRows
                    }
                })
            }
        } catch (e) {
            sendError(e, res);
        }
    },
    get: async (req: TRequestWithId, res: TResponse) => {
        try {
            const id = req.params.id
            const data = await db.query(`SELECT * FROM radar WHERE id = $1`, [id])
            console.log(`Get one id=${id}/ ${data.rows[0]}`)
            res.json({
                msg: [],
                status: StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            })
        } catch (e) {
            sendError(e, res);
        }
    },
    update: async (req: TRequestWithId, res: TResponse) => {
        try {
            const {date, name, count, range} = req.body.data
            const id = req.params.id
            console.log(`PUT radar id=${id}: `, date, name, count, range)
            const data = await db.query(
                `UPDATE radar set date = $1 name = $2 count = $3 range = $4 WHERE id = $5 RETURNING *`,
                [date, name, count, range, id])
            res.json({
                msg: [],
                status: StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            })
        } catch (e) {
            sendError(e, res);
        }
    },
    delete: async (req: TRequestWithId, res: TResponse) => {
        try {
            const id = req.params.id
            const data = await db.query(`DELETE FROM radar WHERE id = $1`, [id])
            console.log(`DELETE one id=${id}/ ${data.rows[0]}`)
            res.json({
                msg: [],
                status: StatusCodes.Ok,
                data: {
                    total: data.rows.length,
                    rows: data.rows
                }
            })
        } catch (e) {
            sendError(e, res);
        }
    },
}