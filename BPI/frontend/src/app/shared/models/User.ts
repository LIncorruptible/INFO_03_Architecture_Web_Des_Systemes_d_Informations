import { Organization } from "./Organization";

export class User {
    id!: string;
    firstName!: string;
    lastName!: string;
    username!: string;
    email!: string;
    token!: string;
    assignedTo!: Organization;
    roleScope!: string;
}