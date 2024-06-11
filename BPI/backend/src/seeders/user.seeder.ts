import { User } from "../models/user.model";
import { faker } from "@faker-js/faker";
import { OrganizationSeeder } from "./organization.seeder";
import { ROLES_SCOPES } from "../constants/all_about_models";
import { OrganizationController } from "../controllers/organization.controller";
import { Response, Request, request } from "express";
import { Organization } from "../models/organization.model";
import bcrypt from 'bcryptjs';

export class UserSeeder {

    async defUser() : Promise<User>{

        const nonAdminRoleScope = ROLES_SCOPES.filter(scope => scope !== "ADMIN");
        const randomIndex = Math.floor(Math.random() * nonAdminRoleScope.length);
        const randomRoleScope: string = nonAdminRoleScope[randomIndex];

        const randomOrganization = await new OrganizationController().getRandom();

        const user: User = {
            id: faker.string.uuid(),
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: await bcrypt.hash("12345", 10),
            assignedTo: randomOrganization || await new OrganizationSeeder().defOrganization(),
            roleScope: randomRoleScope 
        };

        return user;
    }

    async defUsers(amount: number): Promise<User[]> {
        const users: User[] = [];
        for (let i = 0; i < amount; i++) {
            users.push(await this.defUser());
        }
        return users;
    }

    async defUsersAccordingToData(): Promise<User[]> {
        const users: User[] = [];

        const randomOrganization = await new OrganizationController().getRandom();

        const adminRoleScope = ROLES_SCOPES.filter(scope => scope === "admin");

        const adminUser: User = {
            id: faker.string.uuid(),
            firstName: "John",
            lastName: "Doe",
            username: "johndoe",
            email: "johndoe@email.com",
            password: await bcrypt.hash("admin", 10),
            assignedTo: randomOrganization,
            roleScope: adminRoleScope[0]
        };

        users.push(adminUser);

        for (let i = 0; i < 19; i++) {
            const nonAdminRoleScope = ROLES_SCOPES.filter(scope => scope !== "ADMIN");
            const randomIndex = Math.floor(Math.random() * nonAdminRoleScope.length);
            const randomRoleScope: string = nonAdminRoleScope[randomIndex];
    
            const randomOrganization = await new OrganizationController().getRandom();

            const user: User = {
                id: faker.string.uuid(),
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: "12345",
                assignedTo: randomOrganization,
                roleScope: randomRoleScope
            };
            users.push(user);
        }
        return users;
    }
}