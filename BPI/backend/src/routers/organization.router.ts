import expressAsyncHandler from "express-async-handler";
import { OrganizationController } from "../controllers/organization.controller";

const router = require("express").Router();

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().getAll(req, res);
    })
);

router.get(
    "/organization/:id",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().getById(req, res);
    })
);

router.get(
    "/organization/:name",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().getByName(req, res);
    })
);

router.get(
    "/department/:department",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().getByDepartment(req, res);
    })
);

router.get(
    "/search/:searchTerms",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().getBySearchTerms(req, res);
    })
);

router.get(
    "/seed",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().seed(req, res);
    })
);

router.get(
    "/seed/:numberOfOrganizations",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().seed(req, res);
    })
);

router.post(
    "/add",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().add(req, res);
    })
);

router.post(
    "/update/:id",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().update(req, res);
    })
);

router.get(
    "/delete/:id",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().delete(req, res);
    })
);

router.get(
    "/deleteAll",
    expressAsyncHandler(async (req, res) => {
        return new OrganizationController().deleteAll(req, res);
    })
);



export default router;