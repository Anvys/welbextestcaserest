"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.db = exports.dbHost = exports.dbUser = exports.dbName = exports.dbPort = exports.pass = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const radarRoutes_1 = require("./routes/radarRoutes");
const dbconnect_1 = require("./db/dbconnect");
dotenv_1.default.config();
exports.pass = `${process.env.DB_PASS}`;
exports.dbPort = Number(process.env.DB_PORT);
exports.dbName = `${process.env.DB_NAME}`;
exports.dbUser = `${process.env.DB_USER}`;
exports.dbHost = `${process.env.DB_HOST}`;
exports.db = (0, dbconnect_1.getDB)(exports.pass, exports.dbPort, exports.dbName, exports.dbUser, exports.dbHost);
const port = process.env.PORT || 3333;
const allowPort = 3000;
// const STATIC_FILES = path.join(__dirname, '../client/', 'build')
// console.log(STATIC_FILES)
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
// app.use(express.static(STATIC_FILES))
exports.app.use('/api', (0, radarRoutes_1.radarRoutes)());
// app.get('/*', (_, res) => res.sendFile(path.join(STATIC_FILES, 'index.html')))
exports.app.listen(port, () => {
    console.log(`Running on port ${port}`);
    // dbconnect().then((data) => console.log(`connected to ${data.connection?.db.namespace}`)).catch(err => console.log(`server layer => ${err}`))
});
