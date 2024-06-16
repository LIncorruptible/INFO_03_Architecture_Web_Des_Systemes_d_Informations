import { ROLES_SCOPES } from "../constants/all_about_models";
import { Tag } from "../models/tag.model";
import { faker } from "@faker-js/faker";

export class TagSeeder {

    defTag(): Tag {
        const tag: Tag = {
            id: faker.string.uuid(),
            name: "[TAG]" + faker.lorem.word()
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
            { id: faker.string.uuid(), name: "MOBILIER" },
            { id: faker.string.uuid(), name: "BUREAUTIQUE" },
            { id: faker.string.uuid(), name: "RESEAU" },
            { id: faker.string.uuid(), name: "INFORMATIQUE" },
            { id: faker.string.uuid(), name: "AUTRE" }
        ];
        return tags;
    }
}