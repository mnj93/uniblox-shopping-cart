import { Request, Response, NextFunction } from "express";
import cartService from "../services/cartService";
import { CART, PURCHASED_ORDERS } from "../constants/inMemoryDb";

const addToCart = (req: Request, res: Response, next: NextFunction) => {
    try {
        const reqBody = req.body;
        cartService.processAddToCart(reqBody);
        return res.status(200).json({ success: true, data: CART });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err?.message || "Internal server error.",
        });
    }
};

const listCart = (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({ success: true, data: CART });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err?.message || "Internal server error.",
        });
    }
};

const checkoutCart = (req: Request, res: Response, next: NextFunction) => {
    try {
        cartService.processCheckout();
        return res.status(200).json({ success: true, data: PURCHASED_ORDERS });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err?.message || "Internal server error.",
        });
    }
};

export default {
    addToCart,
    listCart,
    checkoutCart,
};
