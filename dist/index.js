"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.db = exports.dbName = exports.dbPort = exports.pass = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const radarRoutes_1 = require("./routes/radarRoutes");
const dbconnect_1 = require("./db/dbconnect");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.pass = `${process.env.DBPASS}`;
exports.dbPort = Number(process.env.DBPORT);
exports.dbName = `${process.env.DBNAME}`;
exports.db = (0, dbconnect_1.getDB)(exports.pass, exports.dbPort, exports.dbName);
const port = process.env.PORT || 3333;
const allowPort = 3000;
const STATIC_FILES = path_1.default.join(__dirname, '../client/', 'build');
console.log(STATIC_FILES);
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `*`);
    // res.setHeader('Access-Control-Allow-Origin', `http://localhost:${allowPort}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
exports.app.use(express_1.default.static(STATIC_FILES));
exports.app.use('/api', (0, radarRoutes_1.radarRoutes)());
exports.app.get('/*', (_, res) => res.sendFile(path_1.default.join(STATIC_FILES, 'index.html')));
exports.app.listen(port, () => {
    console.log(`Running on port ${port}`);
    // dbconnect().then((data) => console.log(`connected to ${data.connection?.db.namespace}`)).catch(err => console.log(`server layer => ${err}`))
});