import expressAsyncHandler from "express-async-handler";

import { OrganizationModel } from "../models/organization.model";

import { HTTP_STATUS } from "../constants/http_status";

const router = require("express").Router();

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const organizations = await OrganizationModel.find({});
        res.send(organizations);
    })
);