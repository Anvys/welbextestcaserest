import express, {Router} from "express";
import {RadarController} from "../controller/radar.controller";

export const radarRoutes = ():Router=>{
    const router = express.Router()

    router.post('/radar', RadarController.create)
    router.get('/radar', RadarController.getAllWithPagination)
    router.get('/radar/:id', RadarController.get)
    router.put('/radar/:id', RadarController.update)
    router.delete('/radar/:id', RadarController.delete)

    return router
}

// fetch('http://localhost:3333/api/radar',
//     {method:'GET',
//         headers:{'content-type':'application/json'}})
//     .then(json => console.log(json)).catch(e=>console.log(e.message))


