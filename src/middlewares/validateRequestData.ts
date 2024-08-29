import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validateRequestData =
    (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (err: any) {
            return res.status(400).json({
                success: false,
                message: err.errors?.map((e: any) => {
                    return {
                        path: e.path.join("."), // Joins the path array to a string like "user.name"
                        message: e.message, // The actual error message
                    };
                }),
            });
        }
    };

export default validateRequestData;
