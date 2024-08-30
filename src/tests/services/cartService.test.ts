import cartService from "../../services/cartService";
import {
    CART,
    PURCHASED_ORDERS,
    DISCOUNT_CODES,
} from "../../constants/inMemoryDb";
import { AddToCardInput } from "../../schemas/cartSchemas";
import * as utilService from "../../services/utilService";

// mocking util service
jest.mock("../../services/utilService");

describe("processAddToCart Service", () => {
    const processAddToCart = cartService.processAddToCart;
    beforeEach(() => {
        CART.length = 0;
    });

    it("should add a new product to an empty cart", () => {
        const input: AddToCardInput = { productId: 1, quantity: 1 };
        // mock the processCheckout method to throw an error
        (utilService.validateProductId as jest.Mock).mockImplementation(() => {
            return { productId: 1, price: 100 };
        });
        processAddToCart(input);

        expect(CART).toEqual([{ productId: 1, quantity: 1, price: 100 }]);
    });

    it("should update the quantity of an existing product in the cart", () => {
        CART.push({ productId: 1, quantity: 1, price: 10 });
        (utilService.validateProductId as jest.Mock).mockImplementation(() => {
            return { productId: 1, price: 10 };
        });
        const input = { productId: 1, quantity: 2 };

        processAddToCart(input);

        expect(CART).toEqual([{ productId: 1, quantity: 3, price: 10 }]); // qty should be updated to 3
    });

    it("should add a new product to a non-empty cart", () => {
        CART.push({ productId: 1, quantity: 1, price: 100 });
        const input = { productId: 2, quantity: 1 };
        (utilService.validateProductId as jest.Mock).mockImplementation(() => {
            return { productId: 1, price: 200 };
        });
        processAddToCart(input);

        expect(CART).toEqual([
            { productId: 1, quantity: 1, price: 100 },
            { productId: 2, quantity: 1, price: 200 },
        ]);
    });

    it("should throw an error if product ID validation fails", () => {
        const input: AddToCardInput = { productId: 999, quantity: 1 };
        (utilService.validateProductId as jest.Mock).mockImplementation(() => {
            throw new Error("Invalid product id.");
        });
        expect(() => processAddToCart(input)).toThrow("Invalid product id.");
    });
});

describe("processCheckout", () => {
    const processCheckout = cartService.processCheckout;
    beforeEach(() => {
        // reset db data
        CART.length = 0;
        PURCHASED_ORDERS.length = 0;
        DISCOUNT_CODES["DISCOUNT10"] = { type: "percentage", amount: 10 };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test to prevent interference
    });

    it("should throw an error if the cart is empty", () => {
        expect(() => processCheckout()).toThrow("Cart is empty.");
    });

    it("should process checkout without a discount code", () => {
        CART.push(
            { productId: 1, price: 100, quantity: 2 }, // total 200
            { productId: 2, price: 50, quantity: 1 } // total 50
        );

        processCheckout();

        expect(PURCHASED_ORDERS.length).toBe(1);
        expect(PURCHASED_ORDERS[0]).toEqual({
            orderTotal: 250,
            paidAmount: 250,
            discountAmount: 0,
            discountCode: null,
            items: [
                { productId: 1, price: 100, quantity: 2 },
                { productId: 2, price: 50, quantity: 1 },
            ],
        });
        expect(CART.length).toBe(0); // Cart should be reset
    });

    it("should apply a discount when a valid discount code is provided", () => {
        CART.push({ productId: 1, price: 100, quantity: 2 }); // total 200

        (utilService.validateDiscountCode as jest.Mock).mockImplementation(
            () => true
        );
        (
            utilService.calculateAndReturnDiscountAmount as jest.Mock
        ).mockReturnValue(20); // 10% discount of 200 is 20

        processCheckout("DISCOUNT10");

        expect(utilService.validateDiscountCode).toHaveBeenCalledWith(
            "DISCOUNT10"
        );
        expect(
            utilService.calculateAndReturnDiscountAmount
        ).toHaveBeenCalledWith(200, {
            type: "percentage",
            amount: 10,
        });

        expect(PURCHASED_ORDERS.length).toBe(1);
        expect(PURCHASED_ORDERS[0]).toEqual({
            orderTotal: 200,
            paidAmount: 180, // 200 - 20 discount
            discountAmount: 20,
            discountCode: "DISCOUNT10",
            items: [{ productId: 1, price: 100, quantity: 2 }],
        });
        expect(CART.length).toBe(0); // cart should be reset
        expect(DISCOUNT_CODES["DISCOUNT10"]).toBeUndefined(); // discount code should be removed
    });

    it("should throw an error when an invalid discount code is provided", () => {
        CART.push({ productId: 1, price: 100, quantity: 2 }); // total 200

        (utilService.validateDiscountCode as jest.Mock).mockImplementation(
            () => {
                throw new Error("Invalid discount code.");
            }
        );

        expect(() => processCheckout("INVALID_CODE")).toThrow(
            "Invalid discount code."
        );
        expect(PURCHASED_ORDERS.length).toBe(0); // no order should be placed
        expect(CART.length).toBe(1); // cart should not be reset
        expect(DISCOUNT_CODES["DISCOUNT10"]).toEqual({
            type: "percentage",
            amount: 10,
        }); // discount code should be there
    });

    it("should remove the discount code after successful checkout", () => {
        CART.push({ productId: 1, price: 100, quantity: 2 }); // total 200

        (utilService.validateDiscountCode as jest.Mock).mockImplementation(
            () => true
        );
        (
            utilService.calculateAndReturnDiscountAmount as jest.Mock
        ).mockReturnValue(20); // 10% discount of 200 is 20

        processCheckout("DISCOUNT10");

        expect(DISCOUNT_CODES["DISCOUNT10"]).toBeUndefined(); // ensure the discount code is removed
        expect(CART.length).toBe(0); // cart should be reset
    });
});
