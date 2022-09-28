import {Pool} from "pg";

export const getDB = (pass:string, dbPort:number, dbName:string) => new Pool({
    user: `postgres`,
    password:pass,
    host: `localhost`,
    port: dbPort ,
    database: dbName
})
