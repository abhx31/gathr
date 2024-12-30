import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
    id?: string
}

export const authenticatedRequest = async function (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(400).json({
            message: "Authentication token is missing",
        })
    }

    const token = authHeader?.split(" ")[1];
    if (!token) {
        return res.status(400).json({
            message: "Token is missing"
        })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string }
    console.log(decoded);

    const user = await prisma.user.findUnique({
        where: {
            email: decoded.email
        }
    })

    console.log("User is" + JSON.stringify(user, null, 2));

    if (!user) {
        return res.status(404).json({
            message: "User does not exist",
        })
    }
    const id = user.id;
    console.log("Middleware:" + id);
    (req as AuthenticatedRequest).id = id;
    next();
}