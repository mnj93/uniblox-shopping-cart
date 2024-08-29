import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    console.log("Inside here");
    return res.status(200).json({ "message": "Welcome to cart APIs" });
});

export default router;
