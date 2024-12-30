"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exitTrip = exports.joinTrip = exports.getAllDestinations = exports.deleteTrip = exports.updateTrip = exports.getTripById = exports.createTrip = void 0;
const client_1 = require("@prisma/client");
const crypto_1 = __importDefault(require("crypto"));
const prisma = new client_1.PrismaClient();
const createTrip = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, description, price, images } = req.body;
            const userId = req.id;
            const user = yield prisma.user.findFirst({
                where: {
                    id: userId,
                }
            });
            if (!user || user.role != "HOST") {
                return res.status(403).json({
                    message: "Only hosts can create trip"
                });
            }
            const generateRandomKey = () => {
                return crypto_1.default.randomBytes(16).toString("hex"); // Generates a 32-character hexadecimal string
            };
            const randomKey = generateRandomKey();
            const destination = yield prisma.trip.create({
                data: {
                    title,
                    description: description || null,
                    price,
                    randomKey,
                    hostId: user.id,
                }
            });
            const imageArray = Array.isArray(images) ? images : [];
            if (imageArray.length > 0) {
                const imageData = images.map((url) => ({
                    url,
                    tripId: destination.id, // Associate each image with the created trip
                }));
                yield prisma.image.createMany({
                    data: imageData,
                });
            }
            return res.status(201).json({
                message: "Destination created successfully",
                destination
            });
        }
        catch (e) {
            console.log(e);
        }
    });
};
exports.createTrip = createTrip;
const getTripById = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const destination = yield prisma.trip.findFirst({
                where: {
                    id
                }
            });
            return res.status(200).json({
                message: "trip fetched successfully",
                destination
            });
        }
        catch (e) {
            console.log(e);
        }
    });
};
exports.getTripById = getTripById;
const updateTrip = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const { title, description, price } = req.body;
            const getDestination = yield prisma.trip.update({
                where: {
                    id
                },
                data: {
                    title,
                    description,
                    price,
                }
            });
            return res.status(200).json({
                message: "Updated successfully",
                getDestination
            });
        }
        catch (e) {
            console.log(e);
        }
    });
};
exports.updateTrip = updateTrip;
const deleteTrip = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const getDestination = yield prisma.trip.findFirst({
                where: {
                    id
                }
            });
            if (!getDestination) {
                return res.status(404).json({
                    message: "Destination does not exist"
                });
            }
            const destination = yield prisma.trip.delete({
                where: {
                    id
                }
            });
            return res.status(200).json({
                message: "Deleted Successfully"
            });
        }
        catch (e) {
            console.log(e);
        }
    });
};
exports.deleteTrip = deleteTrip;
const getAllDestinations = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const allDestinations = yield prisma.trip.findMany({});
        return res.status(200).json({
            message: "Destinations fetched successfully",
            allDestinations
        });
    });
};
exports.getAllDestinations = getAllDestinations;
const joinTrip = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.id;
        console.log(id);
        const destinationId = req.params.id;
        const addAttendee = yield prisma.tripAttendees.create({
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
        });
        return res.status(201).json({
            message: "Added successfully",
            addAttendee
        });
    });
};
exports.joinTrip = joinTrip;
const exitTrip = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.id;
        const tripId = req.params.id;
        const user = yield prisma.tripAttendees.findFirst({
            where: {
                userId,
                tripId
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "You are not added to this trip",
            });
        }
        const removeUser = yield prisma.tripAttendees.delete({
            where: {
                userId_tripId: {
                    userId,
                    tripId
                }
            }
        });
        return res.status(200).json({
            message: "You are exited successfully",
        });
    });
};
exports.exitTrip = exitTrip;
