import { Organization } from "../models/Organization";

export interface INewUser {
    firstName: string;
    lastName: string;
    email: string;
    roleScope: string;
    assignedTo: string;
}