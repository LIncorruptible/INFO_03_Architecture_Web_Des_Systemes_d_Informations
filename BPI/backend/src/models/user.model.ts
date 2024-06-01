import { Schema, model } from "mongoose";
import { Organization, OrganizationModel } from "./organization.model";

import { ROLES_SCOPES, MODELS_NAMES } from "../constants/all_about_models";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    assignedTo: Organization;
    roleScope: string;
}

const userSchema = new Schema<User>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    assignedTo: {type: OrganizationModel, required: true, ref: MODELS_NAMES.ORGANIZATION},
    roleScope: { type: String, required: true, enum: ROLES_SCOPES}
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});

export const UserModel = model<User>(MODELS_NAMES.USER, userSchema);