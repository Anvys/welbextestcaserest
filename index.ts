import express from "express";
import dotenv from 'dotenv'
import {radarRoutes} from "./routes/radarRoutes";
import {getDB} from "./db/dbconnect";
import path from "path";
dotenv.config()

export const pass = `${process.env.DB_PASS}`
export const dbPort = Number(process.env.DB_PORT)
export const dbName = `${process.env.DB_NAME}`
export const dbUser = `${process.env.DB_USER}`
export const dbHost = `${process.env.DB_HOST}`
export const db = getDB(pass, dbPort, dbName,dbUser,dbHost)
const port = process.env.PORT || 3333;
const allowPort = 3000

const STATIC_FILES = path.join(__dirname, '../client/', 'build')
console.log(STATIC_FILES)

export const app = express()
app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `*`);
    // res.setHeader('Access-Control-Allow-Origin', `http://localhost:${allowPort}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(express.static(STATIC_FILES))
app.use('/api',radarRoutes())
app.get('/*', (_, res) => res.sendFile(path.join(STATIC_FILES, 'index.html')))


app.listen(port, () => {
    console.log(`Running on port ${port}`)
    // dbconnect().then((data) => console.log(`connected to ${data.connection?.db.namespace}`)).catch(err => console.log(`server layer => ${err}`))
});