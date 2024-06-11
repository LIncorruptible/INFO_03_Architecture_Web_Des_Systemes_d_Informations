import { Material } from "./Material";
import { User } from "./User";

export class Request {
    id!: string;
    requester!: User;
    material!: Material;
    type!: string;
    status!: string;
    date!: Date;
}