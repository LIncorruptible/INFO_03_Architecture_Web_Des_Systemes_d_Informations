import expressAsyncHandler from "express-async-handler";
import { MaterialController } from "../controllers/material.controller";

const router = require("express").Router();

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getAll(req, res);
    })
);

router.get(
    "/material/byId/:id",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getById(req, res);
    })
);

router.get(
    "/material/byName/:name",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getByName(req, res);
    })
);

router.get(
    "/status/:status",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getByStatus(req, res);
    })
);

router.get(
    "/renewalDate/:renewalDateStart-:renewalDateEnd",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getByRenewalDate(req, res);
    })
)

router.get(
    "/returnDeadLine/:returnDeadlineStart-:returnDeadlineEnd",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getByReturnDeadline(req, res);
    })
)

router.get(
    "/search/:searchTerms",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getBySearchTerms(req, res);
    })
);

router.get(
    "/taggedAsOne/:tag",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getAccordingToTag(req, res);
    })
);

router.get(
    "/taggedAsMany/:tags",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getAccordingToTags(req, res);
    })
);

router.get(
    "/assignedTo/:user",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getAccordingToUser(req, res);
    })

);

router.get(
    "/organization/:organization",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().getAccordingToOrganization(req, res);
    })
);

router.get(
    "/seed",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().seed(req, res);
    })
);

router.get(
    "/seed/:numberOfMaterials",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().seed(req, res);
    })
);

router.post(
    "/add",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().add(req, res);
    })
);

router.post(
    "/update/:id",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().update(req, res);
    })
);

router.post(
    "/allocate/:id",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().allocate(req, res);
    })
);

router.post(
    "/refund/:id",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().refund(req, res);
    })
);

router.get(
    "/delete/:id",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().delete(req, res);
    })
);

router.get(
    "/deleteAll",
    expressAsyncHandler(async (req, res) => {
        return new MaterialController().deleteAll(req, res);
    })
);

export default router;