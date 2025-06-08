import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload} from "jsonwebtoken";

export interface IUser extends Document {
  _id: string;
    name: string;
    email: string;
    image: string;
    instagram: string;
    facebook: string;
    linkedin: string;
    bio: string;
           
}


export interface AuthenticatedRequest extends Request {
    user?: IUser | null; // Make sure to import IUser from your User model
}
export const isAuth= async(req:AuthenticatedRequest, res:Response, next:NextFunction)
:Promise<void> => {
    try {   
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
             res.status(401).json({
                message: "Please Login - No token provided",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if(!decoded || !decoded.user)  {
            res.status(401).json({
                message: "Invalid token",
            });
            return;
        }

        req.user = decoded.user; // Attach the user to the request object
        next(); // Call the next middleware or route handler
    }
    catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(401).json({
            message: "Please Login -JWT verification failed",
        }); 
    }

}