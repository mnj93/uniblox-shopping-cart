import { Router } from "express";
import adminController from "../controllers/adminController";
import validateRequestData from "../middlewares/validateRequestData";
import { generateCodeSchema } from "../schemas/adminSchema";

const router = Router();

router.get("/orders", adminController.listOrders);
router.get("/metrics", adminController.fetchDataMetrics);
router.post(
    "/discountCode",
    validateRequestData(generateCodeSchema),
    adminController.generateDiscountCodes
);

export default router;
