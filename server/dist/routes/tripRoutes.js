"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tripRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../auth/auth");
const tripController_1 = require("../controllers/tripController");
exports.tripRoutes = (0, express_1.Router)();
exports.tripRoutes.post('/create', auth_1.authenticatedRequest, tripController_1.createTrip);
exports.tripRoutes.get('/:id', auth_1.authenticatedRequest, tripController_1.getTripById);
exports.tripRoutes.put('/update/:id', auth_1.authenticatedRequest, tripController_1.updateTrip);
exports.tripRoutes.delete('/delete/:id', auth_1.authenticatedRequest, tripController_1.deleteTrip);
exports.tripRoutes.get('/', tripController_1.getAllDestinations);
exports.tripRoutes.post('/join/:id', auth_1.authenticatedRequest, tripController_1.joinTrip);
exports.tripRoutes.delete('/delete/:id', auth_1.authenticatedRequest, tripController_1.deleteTrip);
