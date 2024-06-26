import { faker } from "@faker-js/faker";
import { TagSeeder } from "./tag.seeder";
import { Material } from "../models/material.model";
import { UserSeeder } from "./user.seeder";
import { UserController } from "../controllers/user.controller";
import { TagController } from "../controllers/tag.controller";
import { TagModel } from "../models/tag.model";
import { MATERIAL_STATUS } from "../constants/all_about_models";
import { User, UserModel } from "../models/user.model";

const STOCKED = MATERIAL_STATUS[0];
const USED = MATERIAL_STATUS[1];

export class MaterialSeeder {
    async defMaterial(): Promise<Material> {
        const randomUser = await new UserController().getRandom();
        const stockedUSer = await new UserController().getStockedUser();

        const randomStatus = MATERIAL_STATUS[Math.floor(Math.random() * MATERIAL_STATUS.length)];
        const randomTag = await new TagController().getRandom();

        const material: Material = {
            id: faker.string.uuid(),
            name: faker.lorem.word(),
            taggedAs: randomTag || await new TagSeeder().defTag(),
            status: randomStatus,
            assignedTo: (randomStatus === STOCKED) ? stockedUSer : randomUser,
            forOrganization: Math.random() < 0.5,
            renewalDate: faker.date.future(),
            returnDeadline: faker.date.future()
        };

        return material;
    }
    
    async defMaterials(amount: number) : Promise<Material[]> {
        const materials: Material[] = [];
        for (let i = 0; i < amount; i++) {
            materials.push(await this.defMaterial());
        }
        return materials;
    }

    async defMaterialsForUser(userEmail: string, amount: number): Promise<Material[]> {
        const materials: Material[] = [];

        const user = await UserModel.findOne({ email: userEmail }) as User;

        for (let i = 0; i < amount; i++) {
            const material = await this.defMaterial();
            material.assignedTo = user;
            material.status = USED;
            materials.push(material);
        }

        return materials;
    }

    async defMaterialsAccordingToData(): Promise<Material[]> {
        const materials: Material[] = [];

        const mobilierTags = [
            await TagModel.findOne({ name: "MOBILIER" }), 
            await TagModel.findOne({ name: "BUREAUTIQUE" }), 
            await TagModel.findOne({ name: "RESEAU" }), 
            await TagModel.findOne({ name: "INFORMATIQUE" }), 
            await TagModel.findOne({ name: "AUTRE" })
        ];

        const mobilier = [
            "Bureau en bois",
            "Chaise ergonomique",
            "Armoire métallique",
            "Table de conférence",
            "Lampe de bureau"
        ];

        const bureautique = [
            "Ordinateur portable Dell",
            "Écran 27 pouces Samsung",
            "Clavier mécanique Logitech",
            "Souris optique Microsoft",
            "Serveur HP ProLiant"
        ];

        const reseau = [
            "Téléphone IP Cisco",
            "Routeur Wi-Fi Netgear",
            "Câble Ethernet Cat6",
            "Multiprise parafoudre Belkin",
            "Switch réseau 24 ports"
        ];

        const informatique = [
            "Imprimante multifonction Canon",
            "Projecteur Epson HD",
            "Scanner à plat Epson",
            "Caméra de conférence Logitech",
            "Enceinte Bluetooth JBL"
        ];

        const autre = [
            "Détecteur de fumée Kidde",
            "Multimètre numérique Fluke",
            "Tournevis électrique Bosch",
            "Gants de sécurité Ansell",
            "Autre équipement divers"
        ];

        for (let i = 0; i < 5; i++) {
            const tag = mobilierTags[i] || await new TagController().getRandom();
            const tagItems = (i === 0) ? mobilier : (i === 1) ? bureautique : (i === 2) ? reseau : (i === 3) ? informatique : autre;

            const randomUser = await new UserController().getRandom();
            const stockedUSer = await new UserController().getStockedUser();

            const randomStatus = MATERIAL_STATUS[Math.floor(Math.random() * MATERIAL_STATUS.length)];
            
            for (let j = 0; j < tagItems.length; j++) {
                const material: Material = {
                    id: faker.string.uuid(),
                    name: tagItems[j],
                    taggedAs: tag,
                    status: randomStatus,
                    assignedTo: (randomStatus === STOCKED) ? stockedUSer : randomUser,
                    forOrganization: Math.random() < 0.5,
                    renewalDate: faker.date.future(),
                    returnDeadline: faker.date.future()
                };
                materials.push(material);
            }
        }

        return materials;
    }
}