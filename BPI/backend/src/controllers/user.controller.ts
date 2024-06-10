import { HTTP_STATUS } from "../constants/http_status";
import { OrganizationModel } from "../models/organization.model";
import { User, UserModel } from "../models/user.model";
import { Response, Request } from "express";
import { UserSeeder } from "../seeders/user.seeder";
import { MaterialModel } from "../models/material.model";

export class UserController {

    constructor() {}

    getAll = async (req: Request, res: Response) => {
        const users = await UserModel.find({});
        if (users && users.length > 0) {
            res.send(users);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Users not found" });
        }
    }

    getById = async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    }

    getByUsername = async (req: Request, res: Response) => {
        const user = await UserModel.findOne({ username: req.params.username });
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    }

    getByEmail = async (req: Request, res: Response) => {
        const user = await UserModel.findOne({ email: req.params.email });
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    }

    getByRoleScope = async (req: Request, res: Response) => {
        const users = await UserModel.find({ roleScope: req.params.roleScope });
        if (users) {
            res.send(users);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    }

    getBySearchTerms = async (req: Request, res: Response) => {
        const searchTerms = req.params.searchTerms;
        const users = await UserModel.find({
            $or: [
                { username: { $regex: searchTerms, $options: 'i' } },
                { email: { $regex: searchTerms, $options: 'i' } },
                { firstName: { $regex: searchTerms, $options: 'i' } },
                { lastName: { $regex: searchTerms, $options: 'i' } }
            ]
        });
        if (users) {
            res.send(users);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Users not found" });
        }
    }

    getAccordingToOrganization = async (req: Request, res: Response) => {
        const targetOrganization = req.params.organization;
        if (!targetOrganization) {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
        const users = await UserModel.find({ assignedTo: targetOrganization });
        if (users) {
            res.send(users);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Users not found" });
        }
    }

    seed = async (req: Request, res: Response) => {
        const numberOfUsers = Number(req.params.numberOfUsers);
        const numberOfUsersInDB = await UserModel.countDocuments();
        if (numberOfUsersInDB > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Users already seeded" });
            return;
        }
        const users = (isNaN(numberOfUsers))
            ? await UserModel.insertMany(await new UserSeeder().defUsersAccordingToData())
            : await UserModel.insertMany(await new UserSeeder().defUsers(numberOfUsers));
        
        if (users) {
            res.status(HTTP_STATUS.CREATED).send(users);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error seeding users" });
        }
    }

    private isAlreadyExists = async (username: string, email: string) => {
        const userByUsername = await UserModel.findOne({ username });
        const userByEmail = await UserModel.findOne({ email });

        return !!userByUsername || !!userByEmail;
    }

    add = async (req: Request, res: Response) => {
        const { username, email, password, firstName, lastName, assignedTo, roleScope } = req.body;
        if (await this.isAlreadyExists(username, email)) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "User already exists" });
            return;
        }
        const user = new UserModel({
            username,
            email,
            password,
            firstName,
            lastName,
            assignedTo,
            roleScope
        });
        const createdUser = await user.save();
        if (createdUser) {
            res.status(HTTP_STATUS.CREATED).send(createdUser);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating user" });
        }
    }

    update = async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            const { username, email, password, firstName, lastName, assignedTo, roleScope } = req.body;
            if (await this.isAlreadyExists(username, email)) {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "User already exists" });
                return;
            }
            user.username = username || user.username;
            user.email = email || user.email;
            user.password = password || user.password;
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.assignedTo = assignedTo || user.assignedTo;
            user.roleScope = roleScope || user.roleScope;
            const updatedUser = await user.save();
            if (updatedUser) {
                res.send(updatedUser);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error updating user" });
            }
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    }

    private isRelatedToMaterial = async (userToCheck: User) => {
        const material = await MaterialModel.findOne({ assignedTo: userToCheck });
        return !!material;
    }

    delete = async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.params.id);
        if (user) {
            if (await this.isRelatedToMaterial(user)) {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "User is related to a material" });
                return;
            }
            await user.deleteOne();
            res.send({ message: "User deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    }

    deleteAll = async (req: Request, res: Response) => {
        const deletedUsers = await UserModel.deleteMany({});
        if (deletedUsers) {
            res.send({ message: "All users deleted" });
        } else {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({ message: "Error deleting users" });
        }
    }

    getRandom = async () => {
        const users = await UserModel.find({});
        return users[Math.floor(Math.random() * users.length)];
    }
}