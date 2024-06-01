import expressAsyncHandler from "express-async-handler";

import { MaterialModel } from "../models/material.model";

import { HTTP_STATUS } from "../constants/http_status";
import { TagModel } from "../models/tag.model";
import { ROLES_SCOPES } from "../constants/all_about_models";
import { User, UserModel } from "../models/user.model";

const router = require("express").Router();

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const materials = await MaterialModel.find({});
        res.send(materials);
    })
);