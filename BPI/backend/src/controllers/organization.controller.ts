import { HTTP_STATUS } from "../constants/http_status";
import { Organization, OrganizationModel } from "../models/organization.model";
import { Response, Request } from "express";
import { UserModel } from "../models/user.model";
import { OrganizationSeeder } from "../seeders/organization.seeder";

export class OrganizationController {
    constructor() {}

    getAll = async (req: Request, res: Response) => {
        const organizations = await OrganizationModel.find({});
        if (organizations && organizations.length > 0) {
            res.send(organizations);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organizations not found" });
        }
    }

    getById = async (req: Request, res: Response) => {
        const organization = await OrganizationModel.findById(req.params.id);
        if (organization) {
            res.send(organization);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    }

    getByName = async (req: Request, res: Response) => {
        const organization = await OrganizationModel.findOne({ name: req.params.name });
        if (organization) {
            res.send(organization);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    }

    getByDepartment = async (req: Request, res: Response) => {
        const organizations = await OrganizationModel.find({ department: req.params.department });
        if (organizations) {
            res.send(organizations);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    }

    getBySearchTerms = async (req: Request, res: Response) => {
        const searchTerms = req.params.searchTerms;
        const organizations = await OrganizationModel.find({
            $or: [
                { name: { $regex: searchTerms, $options: 'i' } },
                { department: { $regex: searchTerms, $options: 'i' } }
            ]
        });
        if (organizations) {
            res.send(organizations);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organizations not found" });
        }
    }

    private isAlreadyExists = async (name: string, department: string) => {
        const organization = await OrganizationModel.findOne({ name: name, department: department });
        return !!organization;
    }

    seed = async (req: Request, res: Response) => {
        const numberOfOrganizations = Number(req.params.numberOfOrganizations);

        const numberOfOrganizationsInDB = await OrganizationModel.countDocuments();

        if (numberOfOrganizationsInDB > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Organizations already seeded" });
            return;
        }

        const organizations = (isNaN(numberOfOrganizations))
            ? await OrganizationModel.insertMany(await new OrganizationSeeder().defOrganizationsAccordingToData())
            : await OrganizationModel.insertMany(await new OrganizationSeeder().defOrganizations(numberOfOrganizations));

        if (organizations) {
            res.status(HTTP_STATUS.CREATED).send(organizations);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error seeding organizations" });
        }
    }

    add = async (req: Request, res: Response) => {
        const name = req.body.name;
        const department = req.body.department;
        if (await this.isAlreadyExists(name, department)) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Organization already exists" });
            return;
        }
        const organization = new OrganizationModel({
            name: name,
            department: department
        });
        const createdOrganization = await organization.save();
        if (createdOrganization) {
            res.status(HTTP_STATUS.CREATED).send(createdOrganization);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating organization" });
        }
    } 

    update = async (req: Request, res: Response) => {
        const organization = await OrganizationModel.findById(req.params.id);
        if (organization) {
            const newName = req.body.name || organization.name;
            const newDepartment = req.body.department || organization.department;
            
            const existingOrganization = await OrganizationModel.findOne({ 
                name: newName, 
                department: newDepartment 
            });
            
            if (existingOrganization && existingOrganization._id.toString() !== organization._id.toString()) {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Organization already exists" });
                return;
            }
            
            organization.name = newName;
            organization.department = newDepartment;
            const updatedOrganization = await organization.save();
            res.send(updatedOrganization);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    }

    private isRelatedToUser = async (organizationToCheck: Organization) => {
        const user = await UserModel.findOne({ organization: organizationToCheck });
        return !!user;
    }

    delete = async (req: Request, res: Response) => {
        const organization = await OrganizationModel.findById(req.params.id);
        if (organization) {
            if (await this.isRelatedToUser(organization)) {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Organization is related to user" });
                return;
            }
            const deletedOrganization = await organization.deleteOne();
            
            if (deletedOrganization) {
                res.send(deletedOrganization);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error deleting organization" });
            }
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
    }

    deleteAll = async (req: Request, res: Response) => {
        const deletedOrganizations = await OrganizationModel.deleteMany({});
        
        if(deletedOrganizations) {
            res.send(deletedOrganizations);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error deleting organizations" });
        }
    }

    getRandom = async () => {
        const organizations = await OrganizationModel.find({});
        return organizations[Math.floor(Math.random() * organizations.length)];
    }
}