import { Router } from "express";
import cartRoutes from "./cartRoutes";

const router = Router();

router.use("/cart", cartRoutes);

export default router;
