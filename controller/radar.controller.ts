import {Request, Response} from "express";
import {db} from "../index";
import {exprCodes, StatusCodes, TExprCodes} from "../utils/StatusCodes";
import {QueryResult} from "pg";

type TRadar = {
    date: Date,
    name: string,
    count: number,
    range: number
}
type TQueryResultRadar = {
    id: number,
    date: Date,
    name: string,
    count: number,
    range: number
}
type TRadarKeys = keyof TRadar
type TFilterTypes = keyof Omit<TRadar, 'date'>


type TRequest = Request<{}, {}, TRadar>
type TRequestWithId = Request<{ id: string }, {}, TRadar>
type TRequestPagination = Request<{}, {}, TRadar, {
    filterType?: TRadarKeys
    expr?: string,
    searchStr?: string,
    page?: number,
    count?: number
}>
type TData = {
    total: number
    rows: Array<TQueryResultRadar>
}
type TResponseBody = {
    msg: Array<string>
    status: number,
    data: TData | null
}
type TResponse = Response<TResponseBody>

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

export const RadarController = {
    create: async (req: TRequest, res: TResponse) => {
        try {
            const {date, name, count, range} = req.body
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
            console.log(`Get with filters`)
            console.log(req.query)
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
                // console.log(`1 len=${data.rows.length}`)
                // console.log(`page:${page},count:${count},filterType:${filterType},searchStr:${searchStr},expr:${expr},startIndex:${startIndex}`)
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
                // console.log(`2 len=${data.rows.length}`)
                // console.log(page, count, filterType, searchStr, expr, startIndex)
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
            const {date, name, count, range} = req.body
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