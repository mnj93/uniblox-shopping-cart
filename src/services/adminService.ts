import { PURCHASED_ORDERS } from "../constants/inMemoryDb";

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

export default { fetchAdminData };
