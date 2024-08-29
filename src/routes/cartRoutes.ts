import { Router, Request, Response, NextFunction } from "express";
import validateRequest from "../middlewares/validateRequestData";
import { addToCartSchema } from "../schemas/cartSchemas";
import cartController from "../controllers/cartController";

const router = Router();

// all the cart routes goes here
router.get("/", cartController.listCart);
router.post("/", validateRequest(addToCartSchema), cartController.addToCart);
router.post("/checkout", cartController.checkoutCart);
router.get("/discountCodes", cartController.fetchEligibleDiscountCodes);

export default router;
