import {
    CART,
    DISCOUNT_CODES,
    PURCHASED_ORDERS,
} from "../constants/inMemoryDb";
import { AddToCardInput } from "../schemas/cartSchemas";
import { PRODUCTS } from "../constants/products";
import { Order } from "../constants/appTypes";
import { DISCOUNT_ORDER_COUNT, DISCOUNT_TYPES } from "../constants";

const processAddToCart = (data: AddToCardInput) => {
    // validate the product id
    const product = validateProductId(data);

    // if cart is empty then directly push the item
    if (!CART.length) {
        CART.push({ ...data, price: product.price });
        return;
    }

    // if not empty then check if product already exists and then update quantity
    let existingItem = false;
    CART.forEach((d) => {
        if (d.productId == data.productId) {
            d.quantity += data.quantity;
            existingItem = true;
        }
    });

    if (existingItem) return;

    // item dont exist in cart push directly
    CART.push({ ...data, price: product.price });

    return CART;
};

const validateProductId = (data: AddToCardInput) => {
    const product = PRODUCTS.find((p) => p.id == data.productId);
    if (!product) throw new Error("Invalid product id.");
    return product;
};

const processCheckout = (discountCode: string | null = null) => {
    // check if valid cart is there
    if (!CART.length) throw new Error("Cart is empty.");
    let discountElgible = false;

    // if discount code is there then check validity before processing cart data
    if (discountCode) {
        validateDiscountCode(discountCode);
        discountElgible = true;
    }

    // process and calculate total amount
    let totalAmount = 0;
    let discountAmount = 0;
    CART.forEach((c) => (totalAmount += c.price * c.quantity));

    // calculate the discount amount for eligible order
    if (discountCode && discountElgible) {
        discountAmount = calculateAndReturnDiscountAmount(
            totalAmount,
            DISCOUNT_CODES[discountCode]
        );
    }

    const order: Order = {
        orderTotal: totalAmount,
        paidAmount: totalAmount - discountAmount,
        discountAmount,
        discountCode,
        items: [...CART],
    };

    // add to orders db
    PURCHASED_ORDERS.push(order);

    // reset the cart
    CART.length = 0;

    // remove discount code so it can't be used further
    if (discountCode && discountElgible) {
        delete DISCOUNT_CODES[discountCode];
    }
};

const validateDiscountCode = (code: string) => {
    // check if discount code is valid
    if (!DISCOUNT_CODES[code]) throw new Error("Invalid discount code.");

    // check if order is eligible for discount
    const isEligible = checkEligibility();
    if (!isEligible)
        throw new Error("You're not eligible to use the discount code.");
};

// Determines if the next order is eligible for a discount based on the order count
const checkEligibility = () => {
    const nthOrder = DISCOUNT_ORDER_COUNT;
    const totalProcessedOrders = PURCHASED_ORDERS.length;
    console.log("nthOrder : ", nthOrder);
    console.log("totalProcessedOrders : ", totalProcessedOrders);
    const isEligibleOrder = (totalProcessedOrders + 1) % nthOrder == 0;
    return isEligibleOrder;
};

const calculateAndReturnDiscountAmount = (
    totalAmount: number,
    discountData: { type: string; amount: number }
) => {
    if (discountData.type == DISCOUNT_TYPES.FIXED) return discountData.amount;

    // process and calculate for percentage
    let discountAmount = (totalAmount * discountData.amount) / 100;

    // rounding the amount upto 2 decimals to avoid any issues
    return Math.round((discountAmount + Number.EPSILON) * 100) / 100;
};

const fetchEligibleDiscountCodes = () => {
    return Object.keys(DISCOUNT_CODES);
};

export default {
    processAddToCart,
    processCheckout,
    fetchEligibleDiscountCodes,
};
