import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import { dbConnect } from "./configs/database.config";

dbConnect();

const app = express();

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: "http://localhost:4200"
}));

const port = 5000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});