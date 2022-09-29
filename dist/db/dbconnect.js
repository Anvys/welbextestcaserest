"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDB = void 0;
const pg_1 = require("pg");
const getDB = (pass, dbPort, dbName, user, host) => new pg_1.Pool({
    user: user,
    password: pass,
    host: host,
    port: dbPort,
    database: dbName
});
exports.getDB = getDB;
