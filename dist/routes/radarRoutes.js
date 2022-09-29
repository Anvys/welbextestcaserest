"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.radarRoutes = void 0;
const express_1 = __importDefault(require("express"));
const radar_controller_1 = require("../controller/radar.controller");
const radarRoutes = () => {
    const router = express_1.default.Router();
    router.post('/radar', radar_controller_1.RadarController.create);
    router.get('/radar', radar_controller_1.RadarController.getAllWithPagination);
    router.get('/radar/:id', radar_controller_1.RadarController.get);
    router.put('/radar/:id', radar_controller_1.RadarController.update);
    router.delete('/radar/:id', radar_controller_1.RadarController.delete);
    return router;
};
exports.radarRoutes = radarRoutes;
// fetch('http://localhost:3333/api/radar',
//     {method:'GET',
//         headers:{'content-type':'application/json'}})
//     .then(json => console.log(json)).catch(e=>console.log(e.message))
