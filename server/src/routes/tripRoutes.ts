import { Router } from "express";
import { authenticatedRequest } from "../auth/auth";
import { createTrip, deleteTrip, getAllDestinations, getTripById, joinTrip, updateTrip } from "../controllers/tripController";

export const tripRoutes = Router();

tripRoutes.post('/create', authenticatedRequest as any, createTrip as any);
tripRoutes.get('/:id', authenticatedRequest as any, getTripById as any);
tripRoutes.put('/update/:id', authenticatedRequest as any, updateTrip as any);
tripRoutes.delete('/delete/:id', authenticatedRequest as any, deleteTrip as any);
tripRoutes.get('/', getAllDestinations as any);
tripRoutes.post('/join/:id', authenticatedRequest as any, joinTrip as any);
tripRoutes.delete('/delete/:id', authenticatedRequest as any, deleteTrip as any);