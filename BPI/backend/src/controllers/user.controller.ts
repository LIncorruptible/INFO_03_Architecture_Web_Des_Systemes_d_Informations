import { HTTP_STATUS } from "../constants/http_status";
import { User, UserModel } from "../models/user.model";
import { Response, Request } from "express";
import { UserSeeder } from "../seeders/user.seeder";
import { MaterialModel } from "../models/material.model";
import { SECRET_KEY } from "../configs/config";

import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import mongoose from "mongoose";

export class UserController {

    constructor() {}

    getAll = async (req: Request, res: Response) => {
        const users = await UserModel
            .find({})
            .populate('assignedTo');
        if (users && users.length > 0) {
            res.send(users);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Users not found" });
        }
    }

    getById = async (req: Request, res: Response) => {
        const user = await UserModel
            .findById(req.params.id)
            .populate('assignedTo');
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    }

    getByUsername = async (req: Request, res: Response) => {
        const user = await UserModel
            .findOne({ username: req.params.username })
            .populate('assignedTo');
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    }

    getByEmail = async (req: Request, res: Response) => {
        const user = await UserModel
            .findOne({ email: req.params.email })
            .populate('assignedTo');
        if (user) {
            res.send(user);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
        }
    }

    getByRoleScope = async (req: Request, res: Response) => {
        const users = await UserModel
            .find({ roleScope: req.params.roleScope })
            .populate('assignedTo');
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
        })
            .populate('assignedTo');
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
        const users = await UserModel
            .find({ assignedTo: targetOrganization })
            .populate('assignedTo');
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

    private isAlreadyExistsWithoutSpecifiedUser = async (username: string, email: string, user: User) => {
        const userId = new mongoose.Types.ObjectId(user.id);
    
        const userByUsername = await UserModel.findOne({
            username,
            _id: { $ne: userId }
        });
    
        const userByEmail = await UserModel.findOne({
            email,
            _id: { $ne: userId }
        });
        
        return !!userByUsername || !!userByEmail;
    }
    

    add = async (req: Request, res: Response) => {
        const { firstName, lastName, email, assignedTo, roleScope } = req.body;
        if (await this.isAlreadyExists("", email)) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "User already exists" });
            return;
        }
        
        let user = new UserModel({
            firstName: firstName[0].toUpperCase() + firstName.slice(1),
            lastName: lastName.toUpperCase(),
            email,
            assignedTo,
            roleScope
        });

        user.password = await bcrypt.hash("defaultpwd", 10);
        user.username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;

        const createdUser = await user.save();
        if (createdUser) {
            res.status(HTTP_STATUS.CREATED).send(createdUser);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating user" });
        }
    }

    update = async (req: Request, res: Response) => {
        const targetUser = await UserModel.findById(req.params.id);
        const { user } = req.body;
        const username = `${user.firstName.toLowerCase()}${user.lastName.toLowerCase()}`;

        if (!targetUser) {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "User not found" });
            return;
        }

        if (await this.isAlreadyExistsWithoutSpecifiedUser(username, user.email, targetUser)) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "User already exists" });
            return;
        }

        if (user.firstName != '') targetUser.firstName = user.firstName[0].toUpperCase() + user.firstName.slice(1);
        if (user.lastName != '') targetUser.lastName = user.lastName.toUpperCase();
        targetUser.username = username;
        if (user.email != '') targetUser.email = user.email;
        if (user.password != '') targetUser.password = await bcrypt.hash(user.password, 10);

        const updatedUser = await targetUser.save();
        if (updatedUser) {
            res.send(this.generateTokenReponse(updatedUser));
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error updating user" });
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
            const users = await UserModel.find({});
            if (users) {
                res.send(users);
            } else {
                res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Users not found" });
            }
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

    private generateTokenReponse = (user : User) => {
        const token = jwt.sign({
            id: user.id, email:user.email, roleScope: user.roleScope
        }, SECRET_KEY!,{
            expiresIn:"30d"
        });

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            assignedTo: user.assignedTo,
            roleScope: user.roleScope,
            token: token
        };
    }

    login = async (req: any, res: any) => {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email: email});

        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                res.send(this.generateTokenReponse(user));
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send('Invalid password');
            }
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send('User not found');
        }
    }

    register = async (req: Request, res: Response) => {
        const {
            firstName, 
            lastName, 
            username, 
            email, 
            password,
            assignedTo, 
            roleScope, 
        } = req.body;

        const user = await UserModel.findOne({email: email});
        if(user){
            res.status(HTTP_STATUS.BAD_REQUEST).send('User is already exist, please login!');
            return;
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser:User = {
            id:'',
            firstName,
            lastName,
            username,
            email: email.toLowerCase(),
            password: encryptedPassword,
            assignedTo,
            roleScope
        }

        const dbUser = await UserModel.create(newUser);
        res.send(this.generateTokenReponse(dbUser));
    }

    getRandom = async () => {
        const users = await UserModel.find({});
        return users[Math.floor(Math.random() * users.length)];
    }

    getStockedUser = async () => {
        const user = await UserModel.findOne({ username: "stockedUser" }) as User;
        return user;
    }
}