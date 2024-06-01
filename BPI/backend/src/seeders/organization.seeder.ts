import { Organization } from "../models/organization.model";
import { Faker } from "@faker-js/faker";

export class OrganizationSeeder {

    getOrganization(): Organization {
        const organization: Organization = {
            id: Faker.prototype.datatype.uuid(),
            name: "[ORG]" + Faker.prototype.lorem.word(),
            department: "[DEP] " + Faker.prototype.lorem.word()
        };
        return organization;
    }

    getOrganizations(amount: number): Organization[] {
        const organizations: Organization[] = [];
        for (let i = 0; i < amount; i++) {
            organizations.push(this.getOrganization());
        }
        return organizations;
    }
}