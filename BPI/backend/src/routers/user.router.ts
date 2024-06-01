import expressAsyncHandler from "express-async-handler";

import { UserModel } from "../models/user.model";
import { OrganizationModel } from "../models/organization.model";

import { HTTP_STATUS } from "../constants/http_status";

const router = require("express").Router();

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const users = await UserModel.find({});
        res.send(users);
    })
);