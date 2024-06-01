import { ROLES_SCOPES } from "../constants/all_about_models";
import { Tag } from "../models/tag.model";
import { Faker } from "@faker-js/faker";

export class TagSeeder {

    getTag(): Tag {

        let acceptedScopes: string[] = [];

        const maxElements = Math.floor(Math.random() * ROLES_SCOPES.length) + 1;
        
        while (acceptedScopes.length < maxElements) {
            const randomIndex = Math.floor(Math.random() * ROLES_SCOPES.length);
            const randomScope = ROLES_SCOPES[randomIndex];

            if (!acceptedScopes.includes(randomScope)) acceptedScopes.push(randomScope);
        }

        const tag: Tag = {
            id: Faker.prototype.datatype.uuid(),
            name: Faker.prototype.lorem.word(),
            acceptedRolesScopes: acceptedScopes
        };
        return tag;
    }

    getTags(amount: number): Tag[] {
        const tags: Tag[] = [];
        for (let i = 0; i < amount; i++) {
            tags.push(this.getTag());
        }
        return tags;
    }
}