import { Router } from "express";
import productController from "../controllers/productController";

const router = Router();

router.get("/", productController.listProducts);

export default router;
