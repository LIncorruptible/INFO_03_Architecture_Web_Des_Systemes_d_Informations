import expressAsyncHandler from "express-async-handler";

import { UserModel } from "../models/user.model";
import { OrganizationModel } from "../models/organization.model";

import { HTTP_STATUS } from "../constants/http_status";
import { UserController } from "../controllers/user.controller";

const router = require("express").Router();

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        return new UserController().getAll(req, res);
    })
);

router.get(
    "/user/byId/:id",
    expressAsyncHandler(async (req, res) => {
        return new UserController().getById(req, res);
    })
);

router.get(
    "/user/byUsername/:username",
    expressAsyncHandler(async (req, res) => {
        return new UserController().getByUsername(req, res);
    })
);

router.get(
    "/user/byEmail/:email",
    expressAsyncHandler(async (req, res) => {
        return new UserController().getByEmail(req, res);
    })
);

router.get(
    "/roleScope/:roleScope",
    expressAsyncHandler(async (req, res) => {
        return new UserController().getByRoleScope(req, res);
    })
);

router.get(
    "/search/:searchTerms",
    expressAsyncHandler(async (req, res) => {
        return new UserController().getBySearchTerms(req, res);
    })
);

router.get(
    "/seed",
    expressAsyncHandler(async (req, res) => {
        return new UserController().seed(req, res);
    })
);

router.get(
    "/seed/:numberOfUsers",
    expressAsyncHandler(async (req, res) => {
        return new UserController().seed(req, res);
    })
);

router.get(
    "/organization/:organizationId",
    expressAsyncHandler(async (req, res) => {
        return new UserController().getAccordingToOrganization(req, res);
    })
);

router.post(
    "/add",
    expressAsyncHandler(async (req, res) => {
        return new UserController().add(req, res);
    })
);

router.put(
    "/update/:id",
    expressAsyncHandler(async (req, res) => {
        return new UserController().update(req, res);
    })
);

router.delete(
    "/delete/:id",
    expressAsyncHandler(async (req, res) => {
        return new UserController().delete(req, res);
    })
);

router.get(
    "/deleteAll",
    expressAsyncHandler(async (req, res) => {
        return new UserController().deleteAll(req, res);
    })
);

router.post(
    "/login",
    expressAsyncHandler(async (req, res) => {
        return new UserController().login(req, res);
    })
);

router.post(
    "/register",
    expressAsyncHandler(async (req, res) => {
        return new UserController().register(req, res);
    })
);

export default router;