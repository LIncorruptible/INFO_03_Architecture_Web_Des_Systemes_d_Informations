import expressAsyncHandler from "express-async-handler";

import { RequestModel } from "../models/request.model";

import { HTTP_STATUS } from "../constants/http_status";
import { UserModel } from "../models/user.model";
import { MaterialModel } from "../models/material.model";

const router = require("express").Router();

// GET /api/requests

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const requests = await RequestModel.find({});
        
        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Requests not found" })
        }
    })
);

router.get(
    "/request/:id",
    expressAsyncHandler(async (req, res) => {
        const request = await RequestModel.findById(req.params.id);
        if (request) {
            res.send(request);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    })
);

router.get(
    "/type/:type",
    expressAsyncHandler(async (req, res) => {
        const request = await RequestModel.find({ type: req.params.type });
        if (request) {
            res.send(request);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    })
);

router.get(
    "/status/:status",
    expressAsyncHandler(async (req, res) => {
        const request = await RequestModel.find({ status: req.params.status });
        if (request) {
            res.send(request);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    })
)

router.get(
    "/date/:dateStart-:dateEnd",
    expressAsyncHandler(async (req, res) => {
        const request = await RequestModel.find({ date: { $gte: req.params.dateStart, $lte: req.params.dateEnd } });
        if (request) {
            res.send(request);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    })
);

// GET /api/requests in relation to User

router.get(
    "/requester/:userId",
    expressAsyncHandler(async (req, res) => {

        const targetUser = await UserModel.findById(req.params.userId);

        if (!targetUser) {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }

        const requests = await RequestModel.find({ requester: targetUser });
        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Requests not found" });
        }
    })
);

// GET /api/requests in relation to Material

router.get(
    "/material/:materialId",
    expressAsyncHandler(async (req, res) => {

        const targetMaterial = await MaterialModel.findById(req.params.materialId);

        if (!targetMaterial) {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }

        const requests = await RequestModel.find({ material: targetMaterial });
        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Requests not found" });
        }
    })
);

// POST /api/requests

router.post(
    "/add",
    expressAsyncHandler(async (req, res) => {
        const request = new RequestModel({
            requester: req.body.requester,
            material: req.body.material,
            type: req.body.type,
            status: req.body.status,
            date: req.body.date
        });
        const createdRequest = await request.save();
        if (createdRequest) {
            res.status(HTTP_STATUS.CREATED).send(createdRequest);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating request" });
        }
    })
);

// PUT /api/requests

router.put(
    "/update/:id",
    expressAsyncHandler(async (req, res) => {
        const request = await RequestModel.findById(req.params.id);
        if (request) {
            request.requester = req.body.requester || request.requester;
            request.material = req.body.material || request.material;
            request.type = req.body.type || request.type;
            request.status = req.body.status || request.status;
            request.date = req.body.date || request.date;

            const updatedRequest = await request.save();
            if (updatedRequest) {
                res.send(updatedRequest);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error updating request" });
            }
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    })
);

// DELETE /api/requests

router.delete(
    "/delete/:id",
    expressAsyncHandler(async (req, res) => {
        const request = await RequestModel.findById(req.params.id);
        if (request) {
            await request.deleteOne();
            res.send({ message: "Request deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    })
);

export default router;