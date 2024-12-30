"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = require("./routes/userRoutes");
const tripRoutes_1 = require("./routes/tripRoutes");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use('/api/v1/user', userRoutes_1.userRoutes);
app.use('/api/v1/trip', tripRoutes_1.tripRoutes);
app.listen(process.env.PORT, function () {
    console.log(`App is listening on ${process.env.PORT}`);
});
