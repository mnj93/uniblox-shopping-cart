import { CART } from "../constants/inMemoryDb";
import { AddToCardInput } from "../schemas/cartSchemas";
import { PRODUCTS } from "../constants/products";

const processAddToCart = (data: AddToCardInput) => {
    // validate the product id
    validateProductId(data);

    // if cart is empty then directly push the item
    if (!CART.length) {
        CART.push(data);
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
    CART.push(data);

    return CART;
};

const validateProductId = (data: AddToCardInput) => {
    const product = PRODUCTS.find((p) => p.id == data.productId);
    if (!product) throw new Error("Invalid product id.");
    return;
};

export default { processAddToCart };
