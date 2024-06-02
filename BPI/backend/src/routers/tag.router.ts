import expressAsyncHandler from "express-async-handler";

import { TagModel } from "../models/tag.model";

import { ROLES_SCOPES } from "../constants/all_about_models";
import { HTTP_STATUS } from "../constants/http_status";

const router = require("express").Router();

// GET /api/tags

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const tags = await TagModel.find({});
        if (tags) {
            res.send(tags);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tags not found" });
        }
    })
);

router.get(
    "/tag/:id",
    expressAsyncHandler(async (req, res) => {
        const tag = await TagModel.findById(req.params.id);
        if (tag) {
            res.send(tag);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    })
);

router.get(
    "/tag/:name",
    expressAsyncHandler(async (req, res) => {
        const tag = await TagModel.findOne({ name: req.params.name });
        if (tag) {
            res.send(tag);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    })
);

router.get(
    "/acceptedRolesScopes/:acceptedRolesScopes",
    expressAsyncHandler(async (req, res) => {
        const tags = await TagModel.find({ acceptedRolesScopes: req.params.acceptedRolesScopes });
        if (tags) {
            res.send(tags);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    })
);

router.get(
    "/search/:searchTerms",
    expressAsyncHandler(async (req, res) => {
        const searchTerms = req.params.searchTerms;
        const tags = await TagModel.find({
            $or: [
                { name: { $regex: searchTerms, $options: 'i' } }
            ]
        });
        
        if (tags) {
            res.send(tags);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tags not found" });
        }
    })
);

// POST /api/tags

router.post(
    "/add",
    expressAsyncHandler(async (req, res) => {
        const tag = new TagModel({
            name: req.body.name,
            acceptedRolesScopes: req.body.acceptedRolesScopes || ROLES_SCOPES
        });
        const createdTag = await tag.save();
        if (createdTag)  {
            res.status(HTTP_STATUS.CREATED).send(createdTag);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating tag" });
        }
    })
);

// PUT /api/tags

router.put(
    "/update/:id",
    expressAsyncHandler(async (req, res) => {
        const tag = await TagModel.findById(req.params.id);
        if (tag) {
            tag.name = req.body.name || tag.name;
            tag.acceptedRolesScopes = req.body.acceptedRolesScopes || tag.acceptedRolesScopes;
            const updatedTag = await tag.save();
            res.send(updatedTag);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    })
);

// DELETE /api/tags

router.delete(
    "/delete/:id",
    expressAsyncHandler(async (req, res) => {
        const tag = await TagModel.findById(req.params.id);
        if (tag) {
            await tag.deleteOne();
            res.send({ message: "Tag deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    })
);

export default router;