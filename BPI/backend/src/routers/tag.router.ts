import expressAsyncHandler from "express-async-handler";

import { TagModel } from "../models/tag.model";

import { ROLES_SCOPES } from "../constants/all_about_models";
import { HTTP_STATUS } from "../constants/http_status";

const router = require("express").Router();

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const tags = await TagModel.find({});
        res.send(tags);
    })
);