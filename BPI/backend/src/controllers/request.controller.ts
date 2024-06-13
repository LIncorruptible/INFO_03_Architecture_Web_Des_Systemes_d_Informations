import { HTTP_STATUS } from "../constants/http_status";
import { RequestModel } from "../models/request.model";
import { Response, Request } from "express";
import { RequestSeeder } from "../seeders/request.seeder";

import { Request as CustomRequest } from "../models/request.model";
import { MaterialController } from "./material.controller";
import { REQUEST_STATUS } from "../constants/all_about_models";

const PENDING = REQUEST_STATUS[0];
const APPROVED = REQUEST_STATUS[1];
const DECLINED = REQUEST_STATUS[2];

export class RequestController {

    constructor() {}

    getAll = async (req: Request, res: Response) => {
        const requests = await RequestModel.find({});
        if (requests && requests.length > 0) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Requests not found" });
        }
    }

    getById = async (req: Request, res: Response) => {
        const request = await RequestModel.findById(req.params.id);
        if (request) {
            res.send(request);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    getByType = async (req: Request, res: Response) => {
        const requests = await RequestModel.find({ type: req.params.type });
        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    getByStatus = async (req: Request, res: Response) => {
        const requests = await RequestModel.find({ status: req.params.status });
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
        });
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
        const requests = await RequestModel.find({ user: targetUser });
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
        const requests = await RequestModel.find({ material: targetMaterial });
        if (requests) {
            res.send(requests);
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
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
        const { requester, material, type, status, date } = req.body;
        const request = new RequestModel({
            requester,
            material,
            type,
            status: PENDING,
            date: new Date().getDate()
        });

        if (await this.isAlreadyExists(request)) {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Request already exists" });
            return;
        }

        const createdRequest = await request.save();
        if (createdRequest) {
            res.status(HTTP_STATUS.CREATED).send(createdRequest);
        } else {
            res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error creating request" });
        }
    }

    update = async (req: Request, res: Response) => {
        const request = await RequestModel.findById(req.params.id);
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
        const request = await RequestModel.findById(req.params.id);
        if (request) {
            request.status = APPROVED;
            const updatedRequest = await request.save();
            if (updatedRequest) {
                req.body = { user: request.requester };
                new MaterialController().allocate(req, res);
                res.send(updatedRequest);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error approving request" });
            }
        } else {
            res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Request not found" });
        }
    }

    reject = async (req: Request, res: Response) => {
        const request = await RequestModel.findById(req.params.id);
        if (request) {
            request.status = DECLINED;
            const updatedRequest = await request.save();
            if (updatedRequest) {
                req.params.id = request.material.id;
                new MaterialController().refund(req, res);
                res.send(updatedRequest);
            } else {
                res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Error declining request" });
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