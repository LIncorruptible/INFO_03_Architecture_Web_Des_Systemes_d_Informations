import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../constants/http_status';
import { UserModel } from '../models/user.model';

const verifyAndConvertUser = async (req: Request, res: Response, next: NextFunction) => {
    const { assignedTo } = req.body;

    try {
        const user = await UserModel.findById(assignedTo);
        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).send({ message: "user not found" });
        }
        req.body.assignedTo = user._id;
        next();
    } catch (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Invalid user ID " + assignedTo });
    }
};

export { verifyAndConvertUser };