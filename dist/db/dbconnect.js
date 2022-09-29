"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = void 0;
const pg_1 = require("pg");
const getDB = (pass, dbPort, dbName) => new pg_1.Pool({
    user: `postgres`,
    password: pass,
    host: `localhost`,
    port: dbPort,
    database: dbName
});
exports.getDB = getDB;
