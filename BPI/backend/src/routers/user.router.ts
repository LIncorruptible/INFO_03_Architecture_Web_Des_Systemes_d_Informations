import expressAsyncHandler from "express-async-handler";

import { UserModel } from "../models/user.model";
import { OrganizationModel } from "../models/organization.model";

import { HTTP_STATUS } from "../constants/http_status";

const router = require("express").Router();

// GET /api/users

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const users = await UserModel.find({});
        res.send(users);
    })
);

router.get(
    "/user/:id",
    expressAsyncHandler(async (req, res) => {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    })
);

router.get(
    "/user/:username",
    expressAsyncHandler(async (req, res) => {
        const user = await UserModel.findOne({ username: req.params.username });
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    })
);

router.get(
    "/user/:email",
    expressAsyncHandler(async (req, res) => {
        const user = await UserModel.findOne({ email: req.params.email });
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    })
);

router.get(
    "/user/:roleScope",
    expressAsyncHandler(async (req, res) => {
        const user = await UserModel.find({ roleScope: req.params.roleScope });
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    })
);

// POST /api/users

router.post(
    "/add",
    expressAsyncHandler(async (req, res) => {
        const user = new UserModel({
            username: req.body.username,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            assignedTo: req.body.assignedTo,
            roleScope: req.body.roleScope
        });
        try {

            const createdUser = await user.save();
            res.status(HTTP_STATUS.CREATED).send(createdUser);
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating user" });
        }
    })
);

// PUT /api/users

router.put(
    "/update/:id",
    expressAsyncHandler(async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id);
            if (user) {
                user.username = req.body.username || user.username;
                user.email = req.body.email || user.email;
                user.firstName = req.body.firstName || user.firstName;
                user.lastName = req.body.lastName || user.lastName;
                user.assignedTo = req.body.assignedTo || user.assignedTo;
                user.roleScope = req.body.roleScope || user.roleScope;

                const updatedUser = await user.save();
                res.send(updatedUser);
            } else {
                res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
            }
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error updating user" });
        }
    })
);

// DELETE /api/users

router.delete(
    "/delete/:id",
    expressAsyncHandler(async (req, res) => {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.send({ message: "User deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    })
);