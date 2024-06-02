import expressAsyncHandler from "express-async-handler";

import { Organization, OrganizationModel } from "../models/organization.model";

import { HTTP_STATUS } from "../constants/http_status";

const router = require("express").Router();

// GET /api/organizations

router.get(
    "/",
    expressAsyncHandler(async (req, res) => {
        const organizations = await OrganizationModel.find({});
        if (organizations) {
            res.send(organizations);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    })
);

router.get(
    "/organization/:id",
    expressAsyncHandler(async (req, res) => {
        const organization = await OrganizationModel.findById(req.params.id);
        if (organization) {
            res.send(organization);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    })
);

router.get(
    "/organization/:name",
    expressAsyncHandler(async (req, res) => {
        const organization = await OrganizationModel.findOne({ name: req.params.name });
        if (organization) {
            res.send(organization);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    })
);

router.get(
    "/department/:department",
    expressAsyncHandler(async (req, res) => {
        const organizations = await OrganizationModel.find({ department: req.params.department });
        if (organizations) {
            res.send(organizations);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    })
);

router.get(
    "/search/:searchTerms",
    expressAsyncHandler(async (req, res) => {
        const searchTerms = req.params.searchTerms;
        const organizations = await OrganizationModel.find({
            $or: [
                { name: { $regex: searchTerms, $options: "i" } },
                { department: { $regex: searchTerms, $options: "i" } }
            ]
        });
        
        if (organizations) {
            res.send(organizations);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    })
);

// POST /api/organizations

router.post(
    "/add",
    expressAsyncHandler(async (req, res) => {
        const organization = new OrganizationModel({
            name: req.body.name,
            department: req.body.department
        });
        try {
            const createdOrganization = await organization.save();
            res.status(HTTP_STATUS.CREATED).send(createdOrganization);
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating organization" });
        }
    })
);

// PUT /api/organizations

router.put(
    "/update/:id",
    expressAsyncHandler(async (req, res) => {
        const organization = await OrganizationModel.findById(req.params.id);
        if (organization) {
            organization.name = req.body.name || organization.name;
            organization.department = req.body.department || organization.department;
            const updatedOrganization = await organization.save();
            res.send(updatedOrganization);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    })
);

// DELETE /api/organizations

router.delete(
    "/delete/:id",
    expressAsyncHandler(async (req, res) => {
        const organization = await OrganizationModel.findById(req.params.id);
        if (organization) {
            await organization.deleteOne();
            res.send({ message: "Organization deleted successfully" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    })
);

export default router;