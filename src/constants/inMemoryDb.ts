import { CartItems, DiscountCodes, Order } from "./appTypes";

export const CART: CartItems = [];
export const PURCHASED_ORDERS: Order[] = [];
export const DATA_POINTS = {};
// creating object here so that its easier to check if code already exists with array of objects had to loop through each entry
export const DISCOUNT_CODES: DiscountCodes = {};
export const USED_DISCOUNT_CODE = [];
