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