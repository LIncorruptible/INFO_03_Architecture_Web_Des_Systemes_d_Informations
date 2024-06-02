import expressAsyncHandler from "express-async-handler";

import { MaterialModel } from "../models/material.model";

import { HTTP_STATUS } from "../constants/http_status";
import { TagModel } from "../models/tag.model";
import { UserModel } from "../models/user.model";

const router = require("express").Router();

// GET /api/materials

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const materials = await MaterialModel.find({});
        res.send(materials);
    })
);

router.get(
    "/material/:id",
    expressAsyncHandler(async (req, res) => {
        const material = await MaterialModel.findById(req.params.id);
        if (material) {
            res.send(material);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    })
);

router.get(
    "/material/:name",
    expressAsyncHandler(async (req, res) => {
        const material = await MaterialModel.findOne({ name: req.params.name });
        if (material) {
            res.send(material);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    })
);

router.get(
    "/material/:status",
    expressAsyncHandler(async (req, res) => {
        const material = await MaterialModel.find({ status: req.params.status });
        if (material) {
            res.send(material);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    })
);

router.get(
    "/material/renewal/:renewalDateStart-:renewalDateEnd",
    expressAsyncHandler(async (req, res) => {
        const material = await MaterialModel.find({ renewalDate: { $gte: req.params.renewalDateStart, $lte: req.params.renewalDateEnd } });
        if (material) {
            res.send(material);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    })
)

router.get(
    "/material/return/:returnDeadlineStart-:returnDeadlineEnd",
    expressAsyncHandler(async (req, res) => {
        const material = await MaterialModel.find({ returnDeadline: { $gte: req.params.returnDeadlineStart, $lte: req.params.returnDeadlineEnd } });
        if (material) {
            res.send(material);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    })
)

router.get(
    "/search/:searchTerms",
    expressAsyncHandler(async (req, res) => {
        const searchTerms = req.params.searchTerms;
        const materials = await MaterialModel.find({
            $or: [
                { name: { $regex: searchTerms, $options: 'i' } },
                { renewalDate: { $regex: searchTerms, $options: 'i' } },
                { returnDeadline: { $regex: searchTerms, $options: 'i' } }
            ]
        });
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Failed to fetch materials" });
        }
    })
);

// GET /api/materials by taggedAs

router.get(
    "/taggedAs/:tagId",
    expressAsyncHandler(async (req, res) => {
        const tag = await TagModel.findById(req.params.tagId);
        if (!tag) {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
        const materials = await MaterialModel.find({ taggedAs: tag });
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    })
);

// GET /api/materials by assignedTo

router.get(
    "/assignedTo/:userId",
    expressAsyncHandler(async (req, res) => {

        const targetUser = await UserModel.findById(req.params.userId);

        if (!targetUser) {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }

        const materials = await MaterialModel.find({ assignedTo: targetUser });
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    })

);


// POST /api/materials

router.post(
    "/",
    expressAsyncHandler(async (req, res) => {
        const { name, imgPath, taggedAs, status, assignedTo, renewalDate, returnDeadline } = req.body;
        const material = new MaterialModel({
            name,
            imgPath,
            taggedAs,
            status,
            assignedTo,
            renewalDate,
            returnDeadline
        });
        const createdMaterial = await material.save();
        if (createdMaterial) {
            res.status(HTTP_STATUS.CREATED).send(createdMaterial);
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Failed to create material" });
        }
    })
);

// PUT /api/materials

router.put(
    "/:id",
    expressAsyncHandler(async (req, res) => {
        const materialId = req.params.id;
        const material = await MaterialModel.findById(materialId);
        if (material) {
            material.name = req.body.name || material.name;
            material.imgPath = req.body.imgPath || material.imgPath;
            material.taggedAs = req.body.taggedAs || material.taggedAs;
            material.status = req.body.status || material.status;
            material.assignedTo = req.body.assignedTo || material.assignedTo;
            material.renewalDate = req.body.renewalDate || material.renewalDate;
            material.returnDeadline = req.body.returnDeadline || material.returnDeadline;

            const updatedMaterial = await material.save();
            res.send(updatedMaterial);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    })
);

// DELETE /api/materials

router.delete(
    "/:id",
    expressAsyncHandler(async (req, res) => {
        const material = await MaterialModel.findById(req.params.id);
        if (material) {
            await material.deleteOne();
            res.send({ message: "Material deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    })
);