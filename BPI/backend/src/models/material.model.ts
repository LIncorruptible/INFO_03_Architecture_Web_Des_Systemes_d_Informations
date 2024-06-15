import { Schema, model } from "mongoose";
import { Tag, TagModel } from "./tag.model";

import { MATERIAL_STATUS, MODELS_NAMES } from "../constants/all_about_models";
import { User, UserModel } from "./user.model";

export interface Material {
    id: string;
    name: string;
    taggedAs: Tag;
    status: string;
    assignedTo: User;
    forOrganization: boolean;
    renewalDate: Date;
    returnDeadline: Date;
}

const materialSchema = new Schema<Material>({
    name: { type: String, required: true},
    taggedAs: { type: Schema.Types.ObjectId, required: true, ref: MODELS_NAMES.TAG},
    status: { type: String, required: true, enum: MATERIAL_STATUS},
    assignedTo: { type: Schema.Types.ObjectId, ref: MODELS_NAMES.USER},
    forOrganization: { type: Boolean, required: true },
    renewalDate: { type: Date, required: true },
    returnDeadline: { type: Date, required: true }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});

export const MaterialModel = model<Material>(MODELS_NAMES.MATERIAL, materialSchema);