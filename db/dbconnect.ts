import {Pool} from "pg";

export const getDB = (pass:string, dbPort:number, dbName:string, user:string, host:string) => new Pool({
    user: user,
    password:pass,
    host: host,
    port: dbPort ,
    database: dbName
})
