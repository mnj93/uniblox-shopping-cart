import { PRODUCTS } from "../constants/products";
import { Request, Response, NextFunction } from "express";

const listProducts = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ success: true, data: PRODUCTS });
};

export default {
    listProducts,
};
