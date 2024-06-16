import expressAsyncHandler from "express-async-handler";
import { RequestController } from "../controllers/request.controller";
import { verifyAndConvertUser } from "../middleware/user.middleware";
const router = require("express").Router();

const requestController = new RequestController();

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        await requestController.getAll(req, res);
    })
);

router.get(
    "/request/byId/:id",
    expressAsyncHandler(async (req, res) => {
        await requestController.getById(req, res);
    })
);

router.get(
    "/type/:type",
    expressAsyncHandler(async (req, res) => {
        await requestController.getByType(req, res);
    })
);

router.get(
    "/status/:status",
    expressAsyncHandler(async (req, res) => {
        await requestController.getByStatus(req, res);
    })
);

router.get(
    "/date/:startDate-:endDate",
    expressAsyncHandler(async (req, res) => {
        await requestController.getByPeriod(req, res);
    })
);

router.get(
    "/requester/:user",
    expressAsyncHandler(async (req, res) => {
        await requestController.getAccordingToUser(req, res);
    })
);

router.get(
    "/material/:material",
    expressAsyncHandler(async (req, res) => {
        await requestController.getAccordingToMaterial(req, res);
    })
);

router.get(
    "/organization/:organization",
    expressAsyncHandler(async (req, res) => {
        await requestController.getAccordingToOrganization(req, res);
    })
);

router.get(
    "/seed/:numberOfRequests",
    expressAsyncHandler(async (req, res) => {
        await requestController.seed(req, res);
    })
);

router.post(
    "/add",
    expressAsyncHandler(async (req, res) => {
        await requestController.add(req, res);
    })
);

router.post(
    "/update/:id",
    expressAsyncHandler(async (req, res) => {
        await requestController.update(req, res);
    })
);

router.post(
    "/approve/:id",
    expressAsyncHandler(async (req, res) => {
        await requestController.approve(req, res);
    })
);

router.get(
    "/approve/:id",
    expressAsyncHandler(async (req, res) => {
        await requestController.approve(req, res);
    })
);

router.post(
    "/reject/:id",
    expressAsyncHandler(async (req, res) => {
        await requestController.reject(req, res);
    })
);

router.get(
    "/delete/:id",
    expressAsyncHandler(async (req, res) => {
        await requestController.delete(req, res);
    })
);

router.get(
    "/deleteAll",
    expressAsyncHandler(async (req, res) => {
        await requestController.deleteAll(req, res);
    })
);

export default router;
