import { HTTP_STATUS } from "../constants/http_status";
import { Material, MaterialModel } from "../models/material.model";
import { Response, Request } from "express";
import { MaterialSeeder } from "../seeders/material.seeder";
import { UserModel } from "../models/user.model";
import { MATERIAL_STATUS } from "../constants/all_about_models";

const STOCKED = MATERIAL_STATUS[0];
const USED = MATERIAL_STATUS[1];

export class MaterialController {
    constructor() {}

    getAll = async (req: Request, res: Response) => {
        const materials = await MaterialModel
            .find({})
            .populate("taggedAs")
            .populate("assignedTo");
        if (materials && materials.length > 0) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    }

    getById = async (req: Request, res: Response) => {
        const material = await MaterialModel
            .findById(req.params.id)
            .populate("taggedAs")
            .populate("assignedTo");
        if (material) {
            res.send(material);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    getByName = async (req: Request, res: Response) => {
        const material = await MaterialModel
            .findOne({ name: req.params.name })
            .populate("taggedAs")
            .populate("assignedTo");
        if (material) {
            res.send(material);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    getByStatus = async (req: Request, res: Response) => {
        const materials = await MaterialModel
            .find({ status: req.params.status })
            .populate("taggedAs")
            .populate("assignedTo");
        if (materials && materials.length > 0) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    getByRenewalDate = async (req: Request, res: Response) => {
        const materials = await MaterialModel
            .find({ renewalDate: { 
                $gte: req.params.renewalDateStart, $lte: req.params.renewalDateEnd 
            } })
            .populate("taggedAs")
            .populate("assignedTo");
        if (materials && materials.length > 0) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    getByReturnDeadline = async (req: Request, res: Response) => {
        const materials = await MaterialModel
            .find({ returnDeadline: {
                 $gte: req.params.returnDeadlineStart, $lte: req.params.returnDeadlineEnd 
            } })
            .populate("taggedAs")
            .populate("assignedTo");
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
        })
            .populate("taggedAs")
            .populate("assignedTo");
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Failed to fetch materials" });
        }
    }

    getAccordingToTag = async (req: Request, res: Response) => {
        const targetTag = req.body.tag;
        const materials = await MaterialModel
            .find({ taggedAs: targetTag })
            .populate("taggedAs")
            .populate("assignedTo");
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    }

    getAccordingToTags = async (req: Request, res: Response) => {
        const tags = req.body.tags;
        const materials = await MaterialModel
            .find({ taggedAs: { $in: tags } })
            .populate("taggedAs")
            .populate("assignedTo");
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    }

    getAccordingToUser = async (req: Request, res: Response) => {
        const targetUser = req.body.user;
        const materials = await MaterialModel
            .find({ user: targetUser })
            .populate("taggedAs")
            .populate("assignedTo");
        if (materials) {
            res.send(materials);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Materials not found" });
        }
    }

    getAccordingToOrganization = async (req: Request, res: Response) => {
        const organization = req.body.organization;
        const users = await UserModel.find({ assignedTo: organization });
        const materials = await MaterialModel
            .find({ user: { $in: users } })
            .populate("taggedAs")
            .populate("assignedTo");
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

    seedForUser = async (req: Request, res: Response) => {
        const userEmail = req.params.userEmail;
        const numberOfMaterials = Number(req.params.numberOfMaterials);
        const user = await UserModel.findOne({ email: userEmail });
        if (!user) {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
            return;
        }
        const materials = await MaterialModel.insertMany(await new MaterialSeeder().defMaterialsForUser(userEmail, numberOfMaterials));

        if (materials) {
            res.status(HTTP_STATUS.CREATED).send(materials);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error seeding materials" });
        }
    }

    add = async (req: Request, res: Response) => {
        const { name, taggedAs, status, assignedTo, renewalDate, returnDeadline } = req.body;
        const material = new MaterialModel({
            name,
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

    assign = async (req: Request, res: Response) => {
        const { user } = req.body;
        const material = await MaterialModel.findById(req.params.id);
        if (material) {
            material.assignedTo = user;
            material.status = USED;
            const updatedMaterial = await material.save();

            if (updatedMaterial) {
                res.send(updatedMaterial);
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Failed to update material" });
            }
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Material not found" });
        }
    }

    refund = async (req: Request, res: Response) => {
        const material = await MaterialModel.findById(req.params.id);
        if (material) {
            material.assignedTo = null as any;
            material.status = STOCKED;
            const updatedMaterial = await material.save();

            if (updatedMaterial) {
                res.send(updatedMaterial);
            } else {
                res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Failed to update material" });
            }
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
        const materials = await MaterialModel
            .find({})
            .populate("taggedAs")
            .populate("assignedTo");
        return materials[Math.floor(Math.random() * materials.length)];
    }
}
