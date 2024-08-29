import { Router, Request, Response, NextFunction } from "express";
import cartRoutes from "./cartRoutes";
import productRoutes from "./productRoutes";
import adminRoutes from "./adminRoutes";

const router = Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ "message": "Welcome to cart APIs" });
});
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/admin", adminRoutes);

// return 404 not found for all other routes
router.use("/*", (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({ "message": "Resource not found." });
});

export default router;
