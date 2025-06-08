import { NextFunction, Request, RequestHandler, Response } from 'express';

const TryCatch= (handler: RequestHandler): RequestHandler=> {
    return async (req: Request, res: Response, next:NextFunction) => {
        try {
            await handler(req, res, next);
        } catch (error: any) {
            console.error("Error:", error);
            res.status(500).json({
                message: error instanceof Error ? error.message : "Internal Server Error"
            });
        }
    };

}

export default TryCatch;