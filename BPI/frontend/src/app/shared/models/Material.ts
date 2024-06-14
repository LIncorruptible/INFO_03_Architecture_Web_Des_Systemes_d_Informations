import { Tag } from "./Tag";
import { User } from "./User";

export class Material {
    id!: string;
    name!: string;
    imgPath!: string;
    taggedAs!: Tag;
    status!: string;
    assignedTo!: User;
    forOrganization!: boolean;
    renewalDate!: Date;
    returnDeadline!: Date;
}