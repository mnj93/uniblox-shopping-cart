import { Router } from "express";
import adminController from "../controllers/adminController";

const router = Router();

router.get("/orders", adminController.listOrders);
router.get("/metrics", adminController.fetchDataMetrics);

export default router;
