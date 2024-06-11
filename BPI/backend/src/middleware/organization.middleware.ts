import { Request, Response, NextFunction } from 'express';
import { OrganizationModel } from '../models/organization.model';
import { HTTP_STATUS } from '../constants/http_status';

const verifyAndConvertOrganization = async (req: Request, res: Response, next: NextFunction) => {
    const { assignedTo } = req.body;

    try {
        const organization = await OrganizationModel.findById(assignedTo);
        if (!organization) {
            return res.status(HTTP_STATUS.NOT_FOUND).send({ message: "Organization not found" });
        }
        req.body.assignedTo = organization._id;
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Invalid organization ID " + assignedTo });
    }
};

export { verifyAndConvertOrganization };