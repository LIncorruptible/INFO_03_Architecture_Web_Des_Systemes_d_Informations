import { faker } from "@faker-js/faker";
import { REQUEST_STATUS, REQUEST_TYPES } from "../constants/all_about_models";
import { MaterialController } from "../controllers/material.controller";
import { UserController } from "../controllers/user.controller"
import { Request } from "../models/request.model";

export class RequestSeeder {
    constructor() {}

    defRequest = async() => {
        
        const randomUser = await new UserController().getRandom();
        const randomMaterial = await new MaterialController().getRandom();

        const randomType = REQUEST_TYPES[Math.floor(Math.random() * REQUEST_TYPES.length)];
        const randomStatus = REQUEST_STATUS[Math.floor(Math.random() * REQUEST_STATUS.length)];

        const request : Request = {
            id: faker.string.uuid(),
            requester: randomUser,
            material: randomMaterial,
            type: randomType,
            status: randomStatus,
            date: new Date()
        }

        return request;
    }

    defRequests = async (amount: number) => {
        let requests = [];
        for (let i = 0; i < amount; i++) {
            requests.push(await this.defRequest());
        }
        return requests;
    }
}