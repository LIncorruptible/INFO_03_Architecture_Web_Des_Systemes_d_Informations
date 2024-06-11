import { HTTP_STATUS } from "../constants/http_status";
import { MaterialModel } from "../models/material.model";
import { Response, Request } from "express";
import { MaterialSeeder } from "../seeders/material.seeder";
import { UserController } from "./user.controller";
import { User } from "../models/user.model";

export class MaterialController {
    constructor() {}

    getAll = async (req: Request, res: Response) => {
        const materials = await MaterialModel.find({});
        if (materials && materials.length > 0) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    }

    getById = async (req: Request, res: Response) => {
        const material = await MaterialModel.findById(req.params.id);
        if (material) {
            res.send(material);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    getByName = async (req: Request, res: Response) => {
        const material = await MaterialModel.findOne({ name: req.params.name });
        if (material) {
            res.send(material);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    getByStatus = async (req: Request, res: Response) => {
        const materials = await MaterialModel.find({ status: req.params.status });
        if (materials && materials.length > 0) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    getByRenewalDate = async (req: Request, res: Response) => {
        const materials = await MaterialModel.find({ renewalDate: { $gte: req.params.renewalDateStart, $lte: req.params.renewalDateEnd } });
        if (materials && materials.length > 0) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    getByReturnDeadline = async (req: Request, res: Response) => {
        const materials = await MaterialModel.find({ returnDeadline: { $gte: req.params.returnDeadlineStart, $lte: req.params.returnDeadlineEnd } });
        if (materials && materials.length > 0) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    getBySearchTerms = async (req: Request, res: Response) => {
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
    }

    getAccordingToTag = async (req: Request, res: Response) => {
        const targetTag = req.params.tag;
        const materials = await MaterialModel.find({ taggedAs: targetTag });
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    }

    getAccordingToTags = async (req: Request, res: Response) => {
        const tags = req.params.tags;
        const materials = await MaterialModel.find({ taggedAs: { $in: tags } });
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    }

    getAccordingToUser = async (req: Request, res: Response) => {
        const targetUser = req.params.user;
        const materials = await MaterialModel.find({ user: targetUser });
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    }

    getAccordingToOrganization = async (req: Request, res: Response) => {
        const users = await new UserController().getAccordingToOrganization(req, res);
        const materials = await MaterialModel.find({ user: { $in: users } });
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    }

    seed = async (req: Request, res: Response) => {
        const numberOfMaterials = Number(req.params.numberOfMaterials);
        const numberOfMaterialsInDB = await MaterialModel.countDocuments();
        if (numberOfMaterialsInDB > 0) {
            res.status(HTTP_STATUS.CONFLICT).send({ message: "Materials already seeded" });
            return;
        }
        const materials = (isNaN(numberOfMaterials))
            ? await MaterialModel.insertMany(await new MaterialSeeder().defMaterialsAccordingToData())
            : await MaterialModel.insertMany(await new MaterialSeeder().defMaterials(numberOfMaterials));

        if (materials && materials.length > 0) {
            res.status(HTTP_STATUS.CREATED).send(materials);
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Failed to seed materials" });
        }
    }

    add = async (req: Request, res: Response) => {
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
    }

    update = async (req: Request, res: Response) => {
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
    }

    delete = async (req: Request, res: Response) => {
        const material = await MaterialModel.findById(req.params.id);
        if (material) {
            await material.deleteOne();
            res.send({ message: "Material deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    deleteAll = async (req: Request, res: Response) => {
        const deletedMaterials = await MaterialModel.deleteMany({});
        if (deletedMaterials) {
            res.send({ message: "All materials deleted" });
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Error deleting materials" });
        }
    }

    getRandom = async () => {
        const materials = await MaterialModel.find({});
        return materials[Math.floor(Math.random() * materials.length)];
    }
}
