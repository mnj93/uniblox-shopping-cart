/**
 * This has all the validation and other utility related functions
 * */

import { DISCOUNT_ORDER_COUNT, DISCOUNT_TYPES } from "../constants";
import { DISCOUNT_CODES, PURCHASED_ORDERS } from "../constants/inMemoryDb";
import { PRODUCTS } from "../constants/products";
import { AddToCardInput } from "../schemas/cartSchemas";

export const validateDiscountCode = (code: string) => {
    // check if discount code is valid
    if (!DISCOUNT_CODES[code]) throw new Error("Invalid discount code.");

    // check if order is eligible for discount
    const isEligible = checkEligibility();
    if (!isEligible)
        throw new Error("You're not eligible to use the discount code.");
};

// Determines if the next order is eligible for a discount based on the order count
export const checkEligibility = () => {
    console.log(DISCOUNT_ORDER_COUNT);
    const nthOrder = DISCOUNT_ORDER_COUNT;
    const totalProcessedOrders = PURCHASED_ORDERS.length;
    console.log("nthOrder : ", nthOrder);
    console.log("totalProcessedOrders :", totalProcessedOrders);
    const isEligibleOrder = (totalProcessedOrders + 1) % nthOrder == 0;
    return isEligibleOrder;
};

export const calculateAndReturnDiscountAmount = (
    totalAmount: number,
    discountData: { type: string; amount: number }
) => {
    if (discountData.type == DISCOUNT_TYPES.FIXED) return discountData.amount;

    // process and calculate for percentage
    let discountAmount = (totalAmount * discountData.amount) / 100;

    // rounding the amount upto 2 decimals to avoid any issues
    return Math.round((discountAmount + Number.EPSILON) * 100) / 100;
};

export const validateProductId = (data: AddToCardInput) => {
    const product = PRODUCTS.find((p) => p.id == data.productId);
    if (!product) throw new Error("Invalid product id.");
    return product;
};
