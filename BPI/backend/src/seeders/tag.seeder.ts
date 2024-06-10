import { ROLES_SCOPES } from "../constants/all_about_models";
import { Tag } from "../models/tag.model";
import { faker } from "@faker-js/faker";

export class TagSeeder {

    defTag(): Tag {

        let acceptedScopes: string[] = [];

        const maxElements = Math.floor(Math.random() * ROLES_SCOPES.length) + 1;
        
        while (acceptedScopes.length < maxElements) {
            const randomIndex = Math.floor(Math.random() * ROLES_SCOPES.length);
            const randomScope = ROLES_SCOPES[randomIndex];

            if (!acceptedScopes.includes(randomScope)) acceptedScopes.push(randomScope);
        }

        const tag: Tag = {
            id: faker.string.uuid(),
            name: "[TAG]" + faker.lorem.word(),
            acceptedRolesScopes: acceptedScopes
        };
        return tag;
    }

    defTags(amount: number): Tag[] {
        const tags: Tag[] = [];
        for (let i = 0; i < amount; i++) {
            tags.push(this.defTag());
        }
        return tags;
    }
    
    defTagsAccordingToData(): Tag[] {
        const tags: Tag[] = [
            { id: faker.string.uuid(), name: "MOBILIER", acceptedRolesScopes: [] },
            { id: faker.string.uuid(), name: "BUREAUTIQUE", acceptedRolesScopes: [] },
            { id: faker.string.uuid(), name: "RESEAU", acceptedRolesScopes: [] },
            { id: faker.string.uuid(), name: "INFORMATIQUE", acceptedRolesScopes: [] },
            { id: faker.string.uuid(), name: "AUTRE", acceptedRolesScopes: [] }
        ];
        return tags;
    }
}