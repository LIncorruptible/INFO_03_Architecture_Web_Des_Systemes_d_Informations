import { Schema, model } from "mongoose";

import { MODELS_NAMES, ROLES_SCOPES } from "../constants/all_about_models";

export interface Tag {
    id: string;
    name: string;
    acceptedRolesScopes: string[];
}

const tagSchema = new Schema<Tag>({
    name: { type: String, required: true, unique: true},
    acceptedRolesScopes: { type: [String], required: true, enum: ROLES_SCOPES },
});

export const TagModel = model<Tag>(MODELS_NAMES.TAG, tagSchema);