"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadarRoutes = void 0;
const express_1 = __importDefault(require("express"));
const radar_controller_1 = require("../controller/radar.controller");
const RadarRoutes = () => {
    const router = express_1.default.Router();
    router.post('/radar', radar_controller_1.RadarController.createRow);
    return router;
};
exports.RadarRoutes = RadarRoutes;
