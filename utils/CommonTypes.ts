import {Request, Response} from "express";

export type TRadar = {
    date: Date,
    name: string,
    count: number,
    range: number
}
export type TQueryResultRadar = {
    id: number,
    date: Date,
    name: string,
    count: number,
    range: number
}
export type TRadarKeys = keyof TRadar
export type TFilterTypes = keyof Omit<TRadar, 'date'>

export type TRequestBody = {
    type: string
    data: TRadar
}
export type TRequest = Request<{}, {}, TRequestBody>
export type TRequestWithId = Request<{ id: string }, {}, TRequestBody>
export type TRequestPagination = Request<{}, {}, TRadar, {
    filterType?: TRadarKeys
    expr?: string,
    searchStr?: string,
    page?: number,
    count?: number
}>
export type TData = {
    total: number
    rows: Array<TQueryResultRadar>
}
export type TResponseBody = {
    msg: Array<string>
    status: number,
    data: TData | null
}
export type TResponse = Response<TResponseBody>