import { Response } from "express";
import { AuthenticatedRequest } from "../auth/auth";
import { PrismaClient } from "@prisma/client";
import crypto from 'crypto';

const prisma = new PrismaClient();

export const createTrip = async function (req: AuthenticatedRequest, res: Response) {
    try {
        const { title, description, price, images } = req.body;
        const userId = req.id;

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            }
        })

        if (!user || user.role != "HOST") {
            return res.status(403).json({
                message: "Only hosts can create trip"
            })
        }
        const generateRandomKey = () => {
            return crypto.randomBytes(16).toString("hex"); // Generates a 32-character hexadecimal string
        };

        const randomKey = generateRandomKey() as string;

        const destination = await prisma.trip.create({
            data: {
                title,
                description: description || null,
                price,
                randomKey,
                hostId: user.id,
            }
        })
        const imageArray = Array.isArray(images) ? images : [];
        if (imageArray.length > 0) {
            const imageData = images.map((url: string) => ({
                url,
                tripId: destination.id, // Associate each image with the created trip
            }));

            await prisma.image.createMany({
                data: imageData,
            });
        }

        return res.status(201).json({
            message: "Destination created successfully",
            destination
        })
    } catch (e) {
        console.log(e);
    }
}

export const getTripById = async function (req: AuthenticatedRequest, res: Response) {
    try {
        const id = req.params.id;

        const destination = await prisma.trip.findFirst({
            where: {
                id
            }
        })

        return res.status(200).json({
            message: "trip fetched successfully",
            destination
        })
    } catch (e) {
        console.log(e);
    }
}

export const updateTrip = async function (req: AuthenticatedRequest, res: Response) {
    try {
        const id = req.params.id;
        const { title, description, price } = req.body;

        const getDestination = await prisma.trip.update({
            where: {
                id
            },
            data: {
                title,
                description,
                price,
            }
        })

        return res.status(200).json({
            message: "Updated successfully",
            getDestination
        })

    } catch (e) {
        console.log(e);
    }
}

export const deleteTrip = async function (req: AuthenticatedRequest, res: Response) {
    try {
        const id = req.params.id;
        const getDestination = await prisma.trip.findFirst({
            where: {
                id
            }
        })

        if (!getDestination) {
            return res.status(404).json({
                message: "Destination does not exist"
            })
        }

        const destination = await prisma.trip.delete({
            where: {
                id
            }
        })
        return res.status(200).json({
            message: "Deleted Successfully"
        })
    } catch (e) {
        console.log(e);
    }
}

export const getAllDestinations = async function (req: Request, res: Response) {
    const allDestinations = await prisma.trip.findMany({});
    return res.status(200).json({
        message: "Destinations fetched successfully",
        allDestinations
    })
}

export const joinTrip = async function (req: AuthenticatedRequest, res: Response) {
    const id = req.id as string;
    console.log(id);
    const destinationId = req.params.id;

    const addAttendee = await prisma.tripAttendees.create({
        data: {
            userId: id,
            tripId: destinationId,
        },
        include: {
            trip: {
                include: {
                    host: true,
                }
            }
        }
    })

    return res.status(201).json({
        message: "Added successfully",
        addAttendee
    })
}

export const exitTrip = async function (req: AuthenticatedRequest, res: Response) {
    const userId = req.id as string;
    const tripId = req.params.id;

    const user = await prisma.tripAttendees.findFirst({
        where: {
            userId,
            tripId
        }
    })

    if (!user) {
        return res.status(404).json({
            message: "You are not added to this trip",
        })
    }

    const removeUser = await prisma.tripAttendees.delete({
        where: {
            userId_tripId: {
                userId,
                tripId
            }
        }
    })

    return res.status(200).json({
        message: "You are exited successfully",
    })
}