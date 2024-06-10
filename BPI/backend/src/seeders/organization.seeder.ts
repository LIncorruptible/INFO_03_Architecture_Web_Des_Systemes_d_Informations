import { Organization } from "../models/organization.model";
import { faker } from "@faker-js/faker";

export class OrganizationSeeder {

    defOrganization(): Organization {
        const organization: Organization = {
            id: faker.string.uuid(),
            name: "[ORG]" + faker.lorem.word(),
            department: "[DEP] " + faker.lorem.word()
        };
        return organization;
    }

    defOrganizations(amount: number): Organization[] {
        const organizations: Organization[] = [];
        for (let i = 0; i < amount; i++) {
            organizations.push(this.defOrganization());
        }
        return organizations;
    }

    defOrganizationsAccordingToData(): Organization[] {
        const organizations: Organization[] = [
            { id: faker.string.uuid(), name: "DIRECTION", department: "DIRECTION" },
            { id: faker.string.uuid(), name: "RH", department: "RH" },
            { id: faker.string.uuid(), name: "INFORMATIQUE", department: "INFORMATIQUE" },
            { id: faker.string.uuid(), name: "ADMINISTRATIF", department: "ADMINISTRATIF" },
            { id: faker.string.uuid(), name: "AUTRE", department: "AUTRE" }
        ];
        return organizations;
    }
}