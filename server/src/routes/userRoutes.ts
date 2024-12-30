import { Router } from "express";
import { deleteUser, getAllDestinations, getUserById, showAllAttendees, signin, signup, updateUser } from "../controllers/userController";
import { authenticatedRequest } from "../auth/auth";

export const userRoutes = Router();

userRoutes.post('/signup', signup as any);
userRoutes.post('/signin', signin as any);
userRoutes.get('/id', authenticatedRequest as any, getUserById as any);
userRoutes.delete('/delete', authenticatedRequest as any, deleteUser as any);
userRoutes.put('/update', authenticatedRequest as any, updateUser as any);
userRoutes.get('/destinations', authenticatedRequest as any, getAllDestinations as any);
userRoutes.get('/:id/attendees', authenticatedRequest as any, showAllAttendees as any);

