import {
    CART,
    DISCOUNT_CODES,
    PURCHASED_ORDERS,
} from "../constants/inMemoryDb";
import { AddToCardInput } from "../schemas/cartSchemas";
import { PRODUCTS } from "../constants/products";
import { Order } from "../constants/appTypes";
import {
    validateDiscountCode,
    calculateAndReturnDiscountAmount,
    validateProductId,
} from "./utilService";

const processAddToCart = (data: AddToCardInput) => {
    // validate the product id
    const product = validateProductId(data);
    // if cart is empty then directly push the item
    if (!CART.length) {
        // console.log("CART is empty : ", data);
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

const fetchEligibleDiscountCodes = () => {
    return Object.keys(DISCOUNT_CODES);
};

export default {
    processAddToCart,
    processCheckout,
    fetchEligibleDiscountCodes,
    validateProductId,
};
