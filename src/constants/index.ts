import * as dotenv from "dotenv";
dotenv.config();

export const PORT = 3000;
export const DISCOUNT_ORDER_COUNT = Number(process.env.DISCOUNT_ORDER_COUNT); // This is nth order for which discount will be eligible
export const DISCOUNT_CODE_MIN_LENGTH = 6; // This is min length for discount code, checked while generating code via admin

export const DISCOUNT_TYPES = {
    PERCENTAGE: "percentage",
    FIXED: "fixed",
};
