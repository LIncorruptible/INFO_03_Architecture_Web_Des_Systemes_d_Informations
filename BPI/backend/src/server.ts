import express from "express";
import cors from "cors";

// Import routers
import tagRouter from "./routers/tag.router";
import requestRouter from "./routers/request.router";
import userRouter from "./routers/user.router";
import materialRouter from "./routers/material.router";
import organizationRouter from "./routers/organization.router";

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

// Use routers
app.use("/api/tags", tagRouter);
app.use("/api/requests", requestRouter);
app.use("/api/users", userRouter);
app.use("/api/materials", materialRouter);
app.use("/api/organizations", organizationRouter);

const port = 5000;

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});