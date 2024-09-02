import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import "dotenv/config";
import { UnauthenticatedError } from "../errors/Errors.js";

const authHandlerMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("No valid token");
    }
    next();

    // const token = authHeader.split(" ")[1];
    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     req.user = decoded;
    //     next();
    // } catch (ex) {
    //     res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid token." });
    // }
};

export default authHandlerMiddleware;
