import * as utilService from "../../services/utilService";
import { DISCOUNT_CODES, PURCHASED_ORDERS } from "../../constants/inMemoryDb";
import { DISCOUNT_TYPES } from "../../constants";
import { PRODUCTS } from "../../constants/products";
import { AddToCardInput } from "../../schemas/cartSchemas";

describe("validateDiscountCode", () => {
    const validateDiscountCode = utilService.validateDiscountCode;
    beforeEach(() => {
        DISCOUNT_CODES["DISCOUNT10"] = { type: "percentage", amount: 10 };
        DISCOUNT_CODES["DISCOUNT100"] = { type: "fixed", amount: 100 };
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test to prevent interference
    });

    it("should throw an error if the discount code is invalid", () => {
        expect(() => validateDiscountCode("INVALID_CODE")).toThrow(
            "Invalid discount code."
        );
    });

    it("should throw an error if the user isn't eligible for the discount", () => {
        const eligibilitySpy = jest
            .spyOn(utilService, "checkEligibility")
            .mockReturnValue(false);

        expect(() => validateDiscountCode("DISCOUNT10")).toThrow(
            "You're not eligible to use the discount code."
        );
        eligibilitySpy.mockRestore(); // Restore the original implementation after the test
    });

    it("should not throw an error if the discount code is valid and the user is eligible", () => {
        const eligibilitySpy = jest
            .spyOn(utilService, "checkEligibility")
            .mockReturnValue(true);

        expect(() => validateDiscountCode("DISCOUNT10")).not.toThrow();
        eligibilitySpy.mockRestore(); // Restore the original implementation after the test
    });

    it("should call checkEligibility when a valid discount code is provided", () => {
        const eligibilitySpy = jest
            .spyOn(utilService, "checkEligibility")
            .mockReturnValue(true);

        validateDiscountCode("DISCOUNT10");

        expect(utilService.checkEligibility).toHaveBeenCalled(); // Ensure checkEligibility is called
        eligibilitySpy.mockRestore(); // Restore the original implementation after the test
    });
});

describe("checkEligibility", () => {
    const checkEligibility = utilService.checkEligibility;
    beforeEach(() => {
        PURCHASED_ORDERS.length = 0;
    });

    it("should return false if there are not enough orders to be eligible", () => {
        PURCHASED_ORDERS.push(
            {
                "orderTotal": 60,
                "paidAmount": 60,
                "discountAmount": 0,
                "discountCode": null,
                "items": [
                    {
                        "productId": 2,
                        "quantity": 3,
                        "price": 20,
                    },
                ],
            },
            {
                "orderTotal": 30,
                "paidAmount": 27,
                "discountAmount": 3,
                "discountCode": "DUMMY100",
                "items": [
                    {
                        "productId": 1,
                        "quantity": 3,
                        "price": 10,
                    },
                ],
            }
        ); // Two orders, not eligible if nthOrder is 3

        const result = checkEligibility();
        expect(result).toBe(false);
    });

    it("should return true if the total processed orders is eligible for a discount", () => {
        PURCHASED_ORDERS.push(
            {
                "orderTotal": 60,
                "paidAmount": 60,
                "discountAmount": 0,
                "discountCode": null,
                "items": [
                    {
                        "productId": 2,
                        "quantity": 3,
                        "price": 20,
                    },
                ],
            },
            {
                "orderTotal": 30,
                "paidAmount": 27,
                "discountAmount": 3,
                "discountCode": "DUMMY100",
                "items": [
                    {
                        "productId": 1,
                        "quantity": 3,
                        "price": 10,
                    },
                ],
            },
            {
                "orderTotal": 30,
                "paidAmount": 27,
                "discountAmount": 3,
                "discountCode": "DUMMY1000",
                "items": [
                    {
                        "productId": 1,
                        "quantity": 3,
                        "price": 10,
                    },
                ],
            }
        ); // Three orders, eligible if nthOrder is 4

        const result = checkEligibility();
        expect(result).toBe(true);
    });

    it("should return false if the next order does not make the total processed orders divisible by nthOrder", () => {
        PURCHASED_ORDERS.push(
            {
                "orderTotal": 60,
                "paidAmount": 60,
                "discountAmount": 0,
                "discountCode": null,
                "items": [
                    {
                        "productId": 2,
                        "quantity": 3,
                        "price": 20,
                    },
                ],
            },
            {
                "orderTotal": 30,
                "paidAmount": 27,
                "discountAmount": 3,
                "discountCode": "DUMMY100",
                "items": [
                    {
                        "productId": 1,
                        "quantity": 3,
                        "price": 10,
                    },
                ],
            },
            {
                "orderTotal": 30,
                "paidAmount": 27,
                "discountAmount": 3,
                "discountCode": "DUMMY1000",
                "items": [
                    {
                        "productId": 1,
                        "quantity": 3,
                        "price": 10,
                    },
                ],
            },
            {
                "orderTotal": 30,
                "paidAmount": 27,
                "discountAmount": 3,
                "discountCode": "DUMMY1000",
                "items": [
                    {
                        "productId": 1,
                        "quantity": 3,
                        "price": 10,
                    },
                ],
            }
        ); // Four orders, next order would be 5th, not eligible if nthOrder is 2

        const result = checkEligibility();
        expect(result).toBe(false);
    });
});

describe("calculateAndReturnDiscountAmount", () => {
    const calculateAndReturnDiscountAmount =
        utilService.calculateAndReturnDiscountAmount;
    it("should return the fixed discount amount when discount type is FIXED", () => {
        const totalAmount = 1000;
        const discountData = { type: DISCOUNT_TYPES.FIXED, amount: 100 };

        const result = calculateAndReturnDiscountAmount(
            totalAmount,
            discountData
        );

        expect(result).toBe(100); // expect the fixed discount amount to be returned directly
    });

    it("should calculate and return the correct percentage discount amount", () => {
        const totalAmount = 1000;
        const discountData = { type: DISCOUNT_TYPES.PERCENTAGE, amount: 10 };

        const result = calculateAndReturnDiscountAmount(
            totalAmount,
            discountData
        );

        expect(result).toBe(100); // 10% of 1000 is 100
    });

    it("should round the discount amount to two decimal places", () => {
        const totalAmount = 999.99;
        const discountData = { type: DISCOUNT_TYPES.PERCENTAGE, amount: 10 };

        const result = calculateAndReturnDiscountAmount(
            totalAmount,
            discountData
        );

        expect(result).toBe(100); // 10% of 999.99 is 99.999, which should round to 100
    });

    it("should handle small percentages and round correctly", () => {
        const totalAmount = 1234.56;
        const discountData = { type: DISCOUNT_TYPES.PERCENTAGE, amount: 1.5 }; // 1.5% discount

        const result = calculateAndReturnDiscountAmount(
            totalAmount,
            discountData
        );

        expect(result).toBeCloseTo(18.52, 2); // 1.5% of 1234.56 is 18.5184, which rounds to 18.52
    });

    it("should return 0 for a 0% discount", () => {
        const totalAmount = 1000;
        const discountData = { type: DISCOUNT_TYPES.PERCENTAGE, amount: 0 };

        const result = calculateAndReturnDiscountAmount(
            totalAmount,
            discountData
        );

        expect(result).toBe(0); // 0% discount should return 0
    });

    it("should return 0 if the discount amount is 0 and type is FIXED", () => {
        const totalAmount = 1000;
        const discountData = { type: DISCOUNT_TYPES.FIXED, amount: 0 };

        const result = calculateAndReturnDiscountAmount(
            totalAmount,
            discountData
        );

        expect(result).toBe(0); // fixed discount of 0 should return 0
    });
});

describe("validateProductId", () => {
    const validateProductId = utilService.validateProductId;

    it("should return the product when a valid productId is provided", () => {
        const input: AddToCardInput = { productId: 1, quantity: 1 };

        const result = validateProductId(input);

        expect(result).toEqual({
            "id": 1,
            "title": "Essence Mascara Lash Princess",
            "description":
                "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
            "category": "beauty",
            "price": 10,
            "brand": "Essence",
            "sku": "RCH45Q1A",
            "thumbnail":
                "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
        });
    });

    it("should throw an error when an invalid productId is provided", () => {
        const input: AddToCardInput = { productId: 1000, quantity: 1 };

        expect(() => validateProductId(input)).toThrow("Invalid product id.");
    });

    it("should return the correct product when multiple products are available", () => {
        const input: AddToCardInput = { productId: 2, quantity: 1 };
        const result = validateProductId(input);

        expect(result).toEqual({
            "id": 2,
            "title": "Eyeshadow Palette with Mirror",
            "description":
                "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
            "category": "beauty",
            "price": 20,
            "brand": "Glamour Beauty",
            "sku": "MVCFH27F",
            "thumbnail":
                "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
        });
    });

    it("should handle edge cases like productId as a string", () => {
        const input = { productId: "1" as any, quantity: 1 }; // productId as a string

        const result = validateProductId(input);

        expect(result).toEqual({
            "id": 1,
            "title": "Essence Mascara Lash Princess",
            "description":
                "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
            "category": "beauty",
            "price": 10,
            "brand": "Essence",
            "sku": "RCH45Q1A",
            "thumbnail":
                "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
        });
    });
});
