import { User } from "../models/user.model";
import { Faker } from "@faker-js/faker";
import { OrganizationSeeder } from "./organization.seeder";
import { ROLES_SCOPES } from "../constants/all_about_models";

export class UserSeeder {

    getUser() : User {

        const nonAdminRoleScope = ROLES_SCOPES.filter(scope => scope !== "ADMIN");
        const randomIndex = Math.floor(Math.random() * nonAdminRoleScope.length);
        const randomRoleScope: string = nonAdminRoleScope[randomIndex];

        const user: User = {
            id: Faker.prototype.datatype.uuid(),
            firstName: Faker.prototype.name.firstName(),
            lastName: Faker.prototype.name.lastName(),
            username: Faker.prototype.internet.userName(),
            email: Faker.prototype.internet.email(),
            password: Faker.prototype.internet.password(),
            assignedTo: new OrganizationSeeder().getOrganization(),
            roleScope: randomRoleScope 
        };

        return user;
    }

    getUsers(amount: number): User[] {
        const users: User[] = [];
        for (let i = 0; i < amount; i++) {
            users.push(this.getUser());
        }
        return users;
    }
}