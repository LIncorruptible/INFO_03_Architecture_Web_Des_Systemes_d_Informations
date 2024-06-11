import { Organization } from "../models/Organization";

export interface IUserRegister {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmedPassword: string;
    assignedTo: Organization;
    roleScope: string;
}