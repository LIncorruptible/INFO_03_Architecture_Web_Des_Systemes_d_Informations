import { HTTP_STATUS } from "../constants/http_status";
import { RequestModel } from "../models/request.model";
import { Response, Request } from "express";
import { RequestSeeder } from "../seeders/request.seeder";

import { Request as CustomRequest } from "../models/request.model";
import { MaterialController } from "./material.controller";
import { MATERIAL_STATUS, REQUEST_STATUS, ROLES_SCOPES } from "../constants/all_about_models";
import { User, UserModel } from "../models/user.model";
import { Material, MaterialModel } from "../models/material.model";

const PENDING = REQUEST_STATUS[0];
const APPROVED = REQUEST_STATUS[1];
const DECLINED = REQUEST_STATUS[2];

const USED = MATERIAL_STATUS[1];

const USER = ROLES_SCOPES[2];

export class RequestController {

    constructor() {}

    getAll = async (req: Request, res: Response) => {
        const requests = await RequestModel
            .find({})
            .populate('requester')
            .populate('material');
        if (requests && requests.length > 0) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Requests not found" });
        }
    }

    getById = async (req: Request, res: Response) => {
        const request = await RequestModel
            .findById(req.params.id)
            .populate('requester')
            .populate('material');
        if (request) {
            res.send(request);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    getByType = async (req: Request, res: Response) => {
        const requests = await RequestModel
            .find({ type: req.params.type })
            .populate('requester')
            .populate('material');
        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    getByStatus = async (req: Request, res: Response) => {
        const requests = await RequestModel
            .find({ status: req.params.status })
            .populate('requester')
            .populate('material');
        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    getByPeriod = async (req: Request, res: Response) => {
        const requests = await RequestModel.find({
            date: {
                $gte: req.params.startDate,
                $lt: req.params.endDate
            }
        })
            .populate('requester')
            .populate('material');
        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    getAccordingToUser = async (req: Request, res: Response) => {
        const targetUser = req.params.user;
        if(!targetUser) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "User not found" });
        }
        const requests = await RequestModel
            .find({ requester: targetUser })
            .populate('requester')
            .populate('material');

        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    getAccordingToMaterial = async (req: Request, res: Response) => {
        const targetMaterial = req.params.material;
        if(!targetMaterial) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Material not found" });
        }
        const requests = await RequestModel
            .find({ material: targetMaterial })
            .populate('requester')
            .populate('material');
        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    getAccordingToOrganization = async (req: Request, res: Response) => {
        const targetOrganization = req.params.organization;
        const users = await UserModel.find({ assignedTo: targetOrganization });
        const requests = await RequestModel
            .find({ requester: { $in: users } })
            .populate("requester")
            .populate("material")
        if (requests) {
            res.send(requests);
        } else {
            res.send(HTTP_STATUS.NOT_FOUND).send({ message: "Requests not found" });
        }

    }

    seed = async (req: Request, res: Response) => {
        const numberOfRequests = Number(req.params.numberOfRequests);
        const numberOfRequestsInDB = await RequestModel.countDocuments();
        if (numberOfRequestsInDB > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Requests already seeded" });
            return;
        }
        const requests = await RequestModel.insertMany(await new RequestSeeder().defRequests(numberOfRequests));

        if (requests && requests.length > 0) {
            res.status(HTTP_STATUS.CREATED).send(requests);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error seeding requests" });
        }
    }

    private isAlreadyExists = async (request: CustomRequest) => {
        const requestByCustomRequest = await RequestModel.findOne({
            requester: request.requester,
            material: request.material,
            type: request.type,
            status: request.status
        });

        return !!requestByCustomRequest;
    } 
    
    add = async (req: Request, res: Response) => {
        let { requester, material, type } = req.body;

        requester = await UserModel.findById(requester);
        material = await MaterialModel.findById(material);

        if (material.forOrganization && requester.roleScope === USER) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "User cannot request for organization" });
        } else {
            const request = new RequestModel({
                requester: requester,
                material: material,
                type: type,
                status: PENDING,
                date: new Date()
            });
    
            if (await this.isAlreadyExists(request)) {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Request already exists" });
                return;
            }
    
            const createdRequest = await RequestModel.create(request);
    
            if (createdRequest) {
                res.status(HTTP_STATUS.CREATED).send(createdRequest);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating request" });
            }
        }
    }

    update = async (req: Request, res: Response) => {
        const request = req.body.request;
        if (request) {
            const { requester, material, type, status, date } = req.body;
            if (await this.isAlreadyExists({ requester, material, type, status } as CustomRequest)) {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Request already exists" });
                return;
            }
            request.requester = requester || request.requester;
            request.material = material || request.material;
            request.type = type || request.type;
            request.status = status || request.status;
            request.date = date || request.date;

            const updatedRequest = await request.save();

            if (updatedRequest) {
                res.send(updatedRequest);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error updating request" });
            }
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    approve = async (req: Request, res: Response) => {
        const request = await RequestModel
            .findById(req.params.id)
            .populate('requester')
            .populate('material');
        if (request) {
            request.status = APPROVED;
            const updatedRequest = await request.save();
            if (updatedRequest) {
                const material = await MaterialModel.findById(updatedRequest.material);
                if (material) {
                    material.assignedTo = updatedRequest.requester;
                    material.status = USED;
                    const updatedMaterial = await material.save();

                    if (updatedMaterial) {
                        res.send(updatedRequest);
                    } else {
                        res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error updating material status" });
                    }
                } else {
                    res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error updating material status" });
                }
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error approving request" });
            }
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    reject = async (req: Request, res: Response) => {
        const request = await RequestModel
            .findById(req.params.id)
            .populate('requester')
            .populate('material');
        if (request) {
            request.status = DECLINED;
            const updatedRequest = await request.save();
            if (updatedRequest) {
                res.send(updatedRequest);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error rejecting request" });
            }
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    delete = async (req: Request, res: Response) => {
        const request = await RequestModel.findById(req.params.id);
        if (request) {
            await request.deleteOne();
            res.send({ message: "Request deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    deleteAll = async (req: Request, res: Response) => {
        const requests = await RequestModel.deleteMany({});
        if (requests) {
            res.send({ message: "Requests deleted" });
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Requests not found" });
        }
    }
}