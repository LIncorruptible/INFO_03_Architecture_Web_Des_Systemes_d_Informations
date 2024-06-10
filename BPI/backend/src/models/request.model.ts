import { Schema, SchemaType, model } from 'mongoose';
import { User, UserModel } from './user.model';
import { Material, MaterialModel } from './material.model';

import { REQUEST_STATUS, REQUEST_TYPES, MODELS_NAMES } from '../constants/all_about_models';

export interface Request {
    id: string;
    requester: User;
    material : Material;
    type: string;
    status: string;
    date: Date;
}

const requestSchema = new Schema<Request>({
    requester: { type: Schema.Types.ObjectId, ref: MODELS_NAMES.USER, required: true },
    material: { type: Schema.Types.ObjectId, ref: MODELS_NAMES.MATERIAL, required: true },
    type: { type: String, required: true, enum: REQUEST_TYPES },
    status: { type: String, required: true, enum: REQUEST_STATUS },
    date: { type: Date, required: true },
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});

export const RequestModel = model<Request>(MODELS_NAMES.REQUEST, requestSchema);