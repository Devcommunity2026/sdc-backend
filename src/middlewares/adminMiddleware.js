import errorClass from "../utils/errorClass,.js";
import getUserDetailsByEmail from '../services/userService.js'
import { decodeToken } from "../controllers/jwtController.js";

const adminMiddleware = (req, res, next) => {
    try {
        const userToken = req.cookies?.token;

        if (!userToken) {
            return res.status(401).json({
                success: false,
                message: "No token found"
            });
        }

        const decodedData = await decodeToken(userToken);

        if (!decodedData.success) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }

        const Details = await getUserDetailsByEmail(decodedData.data.email)
        if (!Details.success) {
            next(Details.error)
        }
        if (!Details.data) {
            return res.status(401).json({
                success: false,
                message: "No user found"
            });
        }
        if (!Details.data.role != "admin") {
            return res.status(401).json({
                success: false,
                message: "Access denied"
            });
        }
        req.details = Details.data
        next();
    } catch (error) {
        const err = new errorClass(false, 500, 'Something went wrong', `admin auth failed`, error)
        next(err)
    }
}

export default adminMiddleware