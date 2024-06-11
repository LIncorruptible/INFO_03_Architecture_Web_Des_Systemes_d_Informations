import { Organization } from "../models/Organization";

export interface IUserRegister {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmedPassword: string;
    assignedTo: string;
    roleScope: string;
}