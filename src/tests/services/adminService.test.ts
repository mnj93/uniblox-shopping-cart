import adminService from "../../services/adminService";
import { PURCHASED_ORDERS, DISCOUNT_CODES } from "../../constants/inMemoryDb";
import { GenerateCodeInput } from "../../schemas/adminSchema";

describe("fetchAdminData Service", () => {
    const fetchAdminData = adminService.fetchAdminData;
    beforeEach(() => {
        // mock data
        PURCHASED_ORDERS.push(
            {
                "orderTotal": 90,
                "paidAmount": 90,
                "discountAmount": 0,
                "discountCode": null,
                "items": [
                    {
                        "productId": 2,
                        "quantity": 3,
                        "price": 20,
                    },
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
                "discountCode": "DUMMY100",
                "items": [
                    {
                        "productId": 1,
                        "quantity": 3,
                        "price": 10,
                    },
                ],
            }
        );

        DISCOUNT_CODES["DUMMY10"] = {
            "type": "percentage",
            "amount": 10,
        };
    });

    afterEach(() => {
        // reset mock data
        PURCHASED_ORDERS.length = 0;
        delete DISCOUNT_CODES["DUMMY10"];
    });

    it("should calculate totalItemsPurchased, totalPurchaseAmount, and totalDiscountAmount correctly", () => {
        const result = fetchAdminData();

        expect(result.totalItemsPurchased).toBe(3); // 2 items in first order + 1 item in second order
        expect(result.totalPurchaseAmount).toBe(120); // 90 + 30
        expect(result.totalDiscountAmount).toBe(3); // 0 + 3
    });

    it("should correctly populate discountCodesUsed with the discount codes used in the orders", () => {
        const result = fetchAdminData();
        console.log("result : ", result);
        expect(result.discountCodesUsed).toEqual(["DUMMY100"]);
    });

    it("should correctly populate discountCodesAvailable with the keys from DISCOUNT_CODES", () => {
        const result = fetchAdminData();

        expect(result.discountCodesAvailable).toEqual(["DUMMY10"]);
    });

    it("should return an empty array for discountCodesUsed when no discount codes are used", () => {
        PURCHASED_ORDERS.length = 0;

        PURCHASED_ORDERS.push({
            "orderTotal": 30,
            "paidAmount": 27,
            "discountAmount": 3,
            "discountCode": null,
            "items": [
                {
                    "productId": 1,
                    "quantity": 3,
                    "price": 10,
                },
            ],
        });

        const result = fetchAdminData();

        expect(result.discountCodesUsed).toEqual([]);
    });

    it("should handle an empty PURCHASED_ORDERS array", () => {
        PURCHASED_ORDERS.length = 0;

        const result = fetchAdminData();

        expect(result.totalItemsPurchased).toBe(0);
        expect(result.totalPurchaseAmount).toBe(0);
        expect(result.totalDiscountAmount).toBe(0);
        expect(result.discountCodesUsed).toEqual([]);
        expect(result.discountCodesAvailable).toEqual(["DUMMY10"]);
    });

    it("should handle an empty DISCOUNT_CODES", () => {
        PURCHASED_ORDERS.length = 0;
        delete DISCOUNT_CODES["DUMMY10"];

        const result = fetchAdminData();

        expect(result.totalItemsPurchased).toBe(0);
        expect(result.totalPurchaseAmount).toBe(0);
        expect(result.totalDiscountAmount).toBe(0);
        expect(result.discountCodesUsed).toEqual([]);
        expect(result.discountCodesAvailable).toEqual([]);
    });
});

describe("generateDiscountCodes Service", () => {
    const generateDiscountCodes = adminService.generateDiscountCodes;
    beforeEach(() => {
        // mock data before each test
        DISCOUNT_CODES["DUMMY10"] = {
            "type": "percentage",
            "amount": 10,
        };
        DISCOUNT_CODES["DISCOUNT10"] = {
            "type": "fixed",
            "amount": 10,
        };
    });

    afterEach(() => {
        // reset discount codes object
        Object.keys(DISCOUNT_CODES).forEach((k) => {
            delete DISCOUNT_CODES[k];
        });
    });

    it("should add a new discount code and return the updated DISCOUNT_CODES", () => {
        const newDiscountCode = {
            code: "NEWCODE",
            type: "percentage",
            amount: 15,
        } as GenerateCodeInput;

        const result = generateDiscountCodes(newDiscountCode);

        expect(result).toEqual({
            DUMMY10: { type: "percentage", amount: 10 },
            DISCOUNT10: { type: "fixed", amount: 10 },
            NEWCODE: { type: "percentage", amount: 15 },
        });

        expect(DISCOUNT_CODES["NEWCODE"]).toEqual({
            type: "percentage",
            amount: 15,
        });
    });

    it("should throw an error if the discount code already exists", () => {
        const existingDiscountCode = {
            code: "DISCOUNT10",
            type: "percentage",
            amount: 20,
        } as GenerateCodeInput;

        expect(() => generateDiscountCodes(existingDiscountCode)).toThrow(
            "This discount code is already added."
        );
    });

    it("should handle an empty DISCOUNT_CODES object", () => {
        delete DISCOUNT_CODES["DUMMY10"];
        delete DISCOUNT_CODES["DISCOUNT10"];

        const newDiscountCode = {
            code: "NEWCODE",
            type: "percentage",
            amount: 15,
        } as GenerateCodeInput;

        const result = generateDiscountCodes(newDiscountCode);

        expect(result).toEqual({
            NEWCODE: { type: "percentage", amount: 15 },
        });
    });
});
