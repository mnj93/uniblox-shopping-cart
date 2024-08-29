import { PURCHASED_ORDERS, DISCOUNT_CODES } from "../constants/inMemoryDb";
import { GenerateCodeInput } from "../schemas/adminSchema";

const fetchAdminData = () => {
    let totalItemsPurchased = 0;
    let totalPurchaseAmount = 0;
    let totalDiscountAmount = 0;
    let discountCodesUsed: string[] = [];
    let discountCodesCreated: string[] = [];

    PURCHASED_ORDERS.forEach((o) => {
        totalItemsPurchased += o.items.length;
        totalPurchaseAmount += o.orderTotal;
        totalDiscountAmount += o.discountAmount;
        if (o.discountCode) discountCodesUsed.push(o.discountCode);
    });

    return {
        totalItemsPurchased,
        totalPurchaseAmount,
        totalDiscountAmount,
        discountCodesUsed,
        discountCodesCreated,
    };
};

const generateDiscountCodes = (data: GenerateCodeInput) => {
    console.log("data : ", data);
    // check if discount code already exists
    if (DISCOUNT_CODES[data.code])
        throw new Error("This discount code is already added.");

    DISCOUNT_CODES[data.code] = { type: data.type, amount: data.amount };
    console.log(DISCOUNT_CODES);
    return DISCOUNT_CODES;
};

export default { fetchAdminData, generateDiscountCodes };
