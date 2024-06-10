import expressAsyncHandler from "express-async-handler";
import { TagController } from "../controllers/tag.controller";

const router = require("express").Router();

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        return new TagController().getAll(req, res);
    })
);

router.get(
    "/tag/byId/:id",
    expressAsyncHandler(async (req, res) => {
        return new TagController().getById(req, res);
    })
);

router.get(
    "/tag/byName/:name",
    expressAsyncHandler(async (req, res) => {
        return new TagController().getByName(req, res);
    })
);

router.get(
    "/acceptedRolesScopes/:acceptedRolesScopes",
    expressAsyncHandler(async (req, res) => {
        return new TagController().getByAcceptedRolesScopes(req, res);
    })
);

router.get(
    "/search/:searchTerms",
    expressAsyncHandler(async (req, res) => {
        return new TagController().getBySearchTerms(req, res);
    })
);

router.get(
    "/seed",
    expressAsyncHandler(async (req, res) => {
        return new TagController().seed(req, res);
    })

);

router.get(
    "/seed/:numberOfTags",
    expressAsyncHandler(async (req, res) => {
        return new TagController().seed(req, res);
    })
);

router.post(
    "/add",
    expressAsyncHandler(async (req, res) => {
        return new TagController().add(req, res);
    })
);

router.post(
    "/update/:id",
    expressAsyncHandler(async (req, res) => {
        return new TagController().update(req, res);
    })
);

router.get(
    "/delete/:id",
    expressAsyncHandler(async (req, res) => {
        return new TagController().delete(req, res);
    })
);

router.get(
    "/deleteAll",
    expressAsyncHandler(async (req, res) => {
        return new TagController().deleteAll(req, res);
    })
)

export default router;