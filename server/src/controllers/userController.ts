import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../auth/auth";

const prisma = new PrismaClient();


export const signup = async function (req: Request, res: Response) {
    try {
        const { name, email, role, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 5);

        const existUser = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (existUser) {
            return res.status(401).json({
                message: "User already exists"
            })
        }
        const user = await prisma.user.create({
            data: {
                name,
                email,
                role,
                password: hashedPassword
            }
        })

        return res.status(201).json({
            message: "Signed up Successfully",
            user
        })
    } catch (e) {
        console.log(e);
    }

}

export const signin = async function (req: Request, res: Response) {
    const { email, password } = req.body;

    const findUser = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if (!findUser) {
        return res.status(400).json({
            message: "Email does not exist"
        })
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if (!passwordMatch) {
        return res.status(400).json({
            message: "Incorrect Credentials"
        })
    }

    const token = jwt.sign({ email: findUser.email }, process.env.JWT_SECRET as string);

    // localStorage.setItem("token", token);

    res.status(200).json({
        message: "Sign in sucessfully!",
        token
    })
}

export const getUserById = async function (req: AuthenticatedRequest, res: Response) {
    const userId = req.id;
    const getUser = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })
    return res.status(200).json({
        message: "User fetched Successfully",
        getUser
    })
}

export const deleteUser = async function (req: AuthenticatedRequest, res: Response) {
    const id = req.id;
    const user = await prisma.user.delete({
        where: {
            id
        }
    })

    return res.status(200).json({
        message: "Deleted successfully",
    })
}

export const updateUser = async function (req: AuthenticatedRequest, res: Response) {
    const userId = req.id;
    const { name, email, role, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name: name,
            email: email,
            role: role,
            password: hashedPassword
        }
    })

    return res.status(200).json({
        message: "updated successfully",
        updatedUser
    })
}

export const getAllDestinations = async function (req: AuthenticatedRequest, res: Response) {
    const id = req.id;

    const destinations = await prisma.trip.findMany({
        where: {
            hostId: id
        }
    })

    return res.status(201).json({
        message: "Your destinations are",
        destinations
    })
}


export const showAllAttendees = async function (req: AuthenticatedRequest, res: Response) {
    try {
        const userId = req.id;
        const destinationId = req.params.id

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
                role: "HOST",
            },
        });

        if (!user) {
            return res.status(403).json({
                message: "Only hosts can access this data",
            });
        }

        const trip = await prisma.trip.findFirst({
            where: {
                id: destinationId,
                hostId: userId
            }
        })

        if (!trip) {
            return res.status(404).json({
                message: "You dont have permission to access the trip"
            })
        }

        const attendees = await prisma.tripAttendees.findMany({
            where: {
                tripId: destinationId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }

        })

        return res.status(200).json({
            message: "Attendees fetched successfully",
            attendees,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while fetching attendees",
        });
    }
};
