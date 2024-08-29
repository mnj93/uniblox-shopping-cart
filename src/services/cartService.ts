import { CART, PURCHASED_ORDERS } from "../constants/inMemoryDb";
import { AddToCardInput } from "../schemas/cartSchemas";
import { PRODUCTS } from "../constants/products";
import { Order } from "../constants/appTypes";

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

    // process and calculate total amount
    let totalAmount = 0;
    let discountAmount = 0;
    CART.forEach((c) => (totalAmount += c.price * c.quantity));

    const order: Order = {
        orderTotal: totalAmount,
        paidAmount: totalAmount,
        discountAmount,
        discountCode,
        items: [...CART],
    };

    // add to orders db
    PURCHASED_ORDERS.push(order);

    // reset the cart
    CART.length = 0;
};

export default { processAddToCart, processCheckout };
