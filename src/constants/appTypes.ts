export type CartItem = {
    productId: number;
    quantity: number;
    price: number;
};

export type CartItems = CartItem[];

export type Order = {
    orderTotal: number;
    paidAmount: number;
    discountAmount: number;
    discountCode: string | null;
    items: CartItems;
};

export type AdminData = {
    itemsPurchased: number;
    totalPurchaseAmount: number;
    discountCodesUsed: string[];
    totalDiscountAmount: number;
    discountCodesCreated: string[];
};

type DiscountCode = {
    type: "percentage" | "fixed";
    amount: number;
};

export type DiscountCodes = {
    [code: string]: DiscountCode;
};