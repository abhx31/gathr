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
exports.showAllAttendees = exports.getAllDestinations = exports.updateUser = exports.deleteUser = exports.getUserById = exports.signin = exports.signup = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const signup = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, role, password } = req.body;
            const hashedPassword = yield bcrypt_1.default.hash(password, 5);
            const existUser = yield prisma.user.findFirst({
                where: {
                    email
                }
            });
            if (existUser) {
                return res.status(401).json({
                    message: "User already exists"
                });
            }
            const user = yield prisma.user.create({
                data: {
                    name,
                    email,
                    role,
                    password: hashedPassword
                }
            });
            return res.status(201).json({
                message: "Signed up Successfully",
                user
            });
        }
        catch (e) {
            console.log(e);
        }
    });
};
exports.signup = signup;
const signin = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const findUser = yield prisma.user.findFirst({
            where: {
                email
            }
        });
        if (!findUser) {
            return res.status(400).json({
                message: "Email does not exist"
            });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, findUser.password);
        if (!passwordMatch) {
            return res.status(400).json({
                message: "Incorrect Credentials"
            });
        }
        const token = jsonwebtoken_1.default.sign({ email: findUser.email }, process.env.JWT_SECRET);
        // localStorage.setItem("token", token);
        res.status(200).json({
            message: "Sign in sucessfully!",
            token
        });
    });
};
exports.signin = signin;
const getUserById = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.id;
        const getUser = yield prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        return res.status(200).json({
            message: "User fetched Successfully",
            getUser
        });
    });
};
exports.getUserById = getUserById;
const deleteUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.id;
        const user = yield prisma.user.delete({
            where: {
                id
            }
        });
        return res.status(200).json({
            message: "Deleted successfully",
        });
    });
};
exports.deleteUser = deleteUser;
const updateUser = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.id;
        const { name, email, role, password } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const updatedUser = yield prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name: name,
                email: email,
                role: role,
                password: hashedPassword
            }
        });
        return res.status(200).json({
            message: "updated successfully",
            updatedUser
        });
    });
};
exports.updateUser = updateUser;
const getAllDestinations = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.id;
        const destinations = yield prisma.trip.findMany({
            where: {
                hostId: id
            }
        });
        return res.status(201).json({
            message: "Your destinations are",
            destinations
        });
    });
};
exports.getAllDestinations = getAllDestinations;
const showAllAttendees = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.id;
            const destinationId = req.params.id;
            const user = yield prisma.user.findFirst({
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
            const trip = yield prisma.trip.findFirst({
                where: {
                    id: destinationId,
                    hostId: userId
                }
            });
            if (!trip) {
                return res.status(404).json({
                    message: "You dont have permission to access the trip"
                });
            }
            const attendees = yield prisma.tripAttendees.findMany({
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
            });
            return res.status(200).json({
                message: "Attendees fetched successfully",
                attendees,
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "An error occurred while fetching attendees",
            });
        }
    });
};
exports.showAllAttendees = showAllAttendees;
