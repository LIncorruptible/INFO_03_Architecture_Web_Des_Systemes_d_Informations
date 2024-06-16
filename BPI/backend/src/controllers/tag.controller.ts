import { HTTP_STATUS } from "../constants/http_status";
import { Tag, TagModel } from "../models/tag.model";
import { Response, Request } from "express";
import { TagSeeder } from "../seeders/tag.seeder";
import { MaterialModel } from "../models/material.model";

export class TagController {

    constructor() {}

    getAll = async (req: Request, res: Response) => {
        const tags = await TagModel.find({});
        if (tags && tags.length > 0) {
            res.send(tags);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tags not found" });
        }
    }

    getById = async (req: Request, res: Response) => {
        const tag = await TagModel.findById(req.params.id);
        if (tag) {
            res.send(tag);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    }

    getByName = async (req: Request, res: Response) => {
        const tag = await TagModel.findOne({ name: req.params.name });
        if (tag) {
            res.send(tag);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    }

    getByAcceptedRolesScopes = async (req: Request, res: Response) => {
        const tags = await TagModel.find({ acceptedRolesScopes: req.params.acceptedRolesScopes });
        if (tags) {
            res.send(tags);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    }

    getBySearchTerms = async (req: Request, res: Response) => {
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
    }

    seed = async (req: Request, res: Response) => {
        const numberOfTags = Number(req.params.numberOfTags);
        const numberOfTagsInDB = await TagModel.countDocuments();
        if (numberOfTagsInDB > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Tags already seeded" });
            return;
        }
        const tags = (isNaN(numberOfTags)) 
            ? await TagModel.insertMany(new TagSeeder().defTagsAccordingToData()) 
            : await TagModel.insertMany(new TagSeeder().defTags(numberOfTags));

        if (tags && tags.length > 0) {
            res.status(HTTP_STATUS.CREATED).send(tags);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error seeding tags" });
        }
    }

    private isAlreadyExists = async (tagName: string) => {
        const tag = await TagModel.findOne({ name: tagName });
        return !!tag;
    }

    add = async (req: Request, res: Response) => {
        const tagName = req.body.name;
        const acceptedRolesScopes = req.body.acceptedRolesScopes || [];

        if (await this.isAlreadyExists(tagName)) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Tag already exists" });
            return;
        }
        const tag = new TagModel({
            name: tagName,
            acceptedRolesScopes: acceptedRolesScopes
        });
        const createdTag = await tag.save();
        if (createdTag)  {
            res.status(HTTP_STATUS.CREATED).send(createdTag);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating tag" });
        }
    }

    update = async (req: Request, res: Response) => {
        const tag = await TagModel.findById(req.params.id);
        if (tag) {
            const newName = req.body.name;
            if (newName && newName !== tag.name) {
                const isDuplicate = await this.isAlreadyExists(newName);
                if (isDuplicate) {
                    res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Tag already exists" });
                    return;
                }
            }
            tag.name = newName || tag.name;
            const updatedTag = await tag.save();
            res.send(updatedTag);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    }

    private isRelatedToMaterial = async (tagToCheck: Tag) => {
        const material = await MaterialModel.findOne({ taggedAs: tagToCheck });
        return !!material;
    }

    delete = async (req: Request, res: Response) => {
        const tag = await TagModel.findById(req.params.id);
        if (tag) {
            if (await this.isRelatedToMaterial(tag)) {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Tag is related to a material" });
                return;
            }
            const deletedTag = await tag.deleteOne();
            if(deletedTag) {
                res.send(deletedTag);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error deleting tag" });
            }
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Tag not found" });
        }
    }

    deleteAll = async (req: Request, res: Response) => {
        const deletedTags = await TagModel.deleteMany({});
        if (deletedTags) {
            res.send(deletedTags);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error deleting tags" });
        }
    }

    getRandom = async () => {
        const tags = await TagModel.find({});

        const tag: Tag = tags[Math.floor(Math.random() * tags.length)];

        return tag;
    }
}