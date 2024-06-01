import { Schema, model } from "mongoose";
import { MODELS_NAMES } from "../constants/all_about_models";

export interface Organization {
    id: string;
    name: string;
    department: string;
}

const organizationSchema = new Schema<Organization>({
    name: { type: String, required: true },
    department: { type: String, required: true }
});

export const OrganizationModel = model<Organization>(MODELS_NAMES.ORGANIZATION, organizationSchema);