import { Request, Response, NextFunction } from "express";
import { PURCHASED_ORDERS } from "../constants/inMemoryDb";
import adminService from "../services/adminService";

const listOrders = (req: Request, res: Response, next: NextFunction) => {
    try {
        return res.status(200).json({ success: true, data: PURCHASED_ORDERS });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err?.message || "Internal server error.",
        });
    }
};

const fetchDataMetrics = (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = adminService.fetchAdminData();
        return res.status(200).json({ success: true, data });
    } catch (err: any) {
        return res.status(400).json({
            success: false,
            message: err?.message || "Internal server error.",
        });
    }
};

export default {
    listOrders,
    fetchDataMetrics,
};
