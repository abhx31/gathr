import express from 'express';
import dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes';
import { tripRoutes } from './routes/tripRoutes';

const app = express();

dotenv.config();
app.use(express.json());
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/trip', tripRoutes);

app.listen(process.env.PORT, function () {
    console.log(`App is listening on ${process.env.PORT}`)
})