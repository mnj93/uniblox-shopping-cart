import { Router, Request, Response, NextFunction } from "express";
import cartRoutes from "./cartRoutes";
import productRoutes from "./productRoutes";

const router = Router();

router.use("/products", productRoutes);
router.use("/cart", cartRoutes);

// return 404 not found for all other routes
router.use("/*", (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({ "message": "Resource not found." });
});

export default router;
