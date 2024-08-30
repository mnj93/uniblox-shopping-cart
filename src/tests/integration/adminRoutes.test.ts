import request from "supertest";
import app from "../../app";

// Mock the internal db data
jest.mock("../../constants/inMemoryDb", () => {
    return {
        PURCHASED_ORDERS: [],
        DISCOUNT_CODES: {},
    };
});

describe("GET /admin/orders", () => {
    let PURCHASED_ORDERS: any[];

    beforeEach(() => {
        // Import the mocked PURCHASED_ORDERS array and reset it before each test
        PURCHASED_ORDERS =
            require("../../constants/inMemoryDb").PURCHASED_ORDERS;
        PURCHASED_ORDERS.length = 0; // Clear the array
    });
    it("should return an empty array with success when purchased orders are empty", async () => {
        const response = await request(app).get("/api/admin/orders");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(0);
    });

    it("should return orders data with success", async () => {
        PURCHASED_ORDERS.push({
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
        });
        PURCHASED_ORDERS.push({
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
        });
        const response = await request(app).get("/api/admin/orders");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(2);

        // checks for the product data structure
        expect(response.body.data[0]).toHaveProperty("orderTotal");
        expect(response.body.data[0]).toHaveProperty("paidAmount");
        expect(response.body.data[0]).toHaveProperty("discountAmount");
        expect(response.body.data[0]).toHaveProperty("discountCode");
        expect(response.body.data[0]).toHaveProperty("items");

        // check for values
        expect(response.body.data[0]).toEqual({
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
        });
        expect(response.body.data[1]).toEqual({
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
        });
    });
});

describe("GET /admin/metircs", () => {
    let PURCHASED_ORDERS: any[];
    let DISCOUNT_CODES: { [key: string]: { type: string; amount: number } };

    beforeEach(() => {
        // Import the mocked PURCHASED_ORDERS array and reset it before each test
        PURCHASED_ORDERS =
            require("../../constants/inMemoryDb").PURCHASED_ORDERS;
        PURCHASED_ORDERS.length = 0; // Clear the array

        DISCOUNT_CODES = require("../../constants/inMemoryDb").DISCOUNT_CODES;
        for (const key in DISCOUNT_CODES) {
            delete DISCOUNT_CODES[key]; // Clear the existing object
        }
    });
    it("should return proper data when purchased orders are empty", async () => {
        const response = await request(app).get("/api/admin/metrics");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            "discountCodesAvailable": [],
            "discountCodesUsed": [],
            "totalDiscountAmount": 0,
            "totalItemsPurchased": 0,
            "totalPurchaseAmount": 0,
        });
    });

    it("should return proper data when purchased orders are non empty", async () => {
        PURCHASED_ORDERS.push({
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
        });
        PURCHASED_ORDERS.push({
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
        });
        const response = await request(app).get("/api/admin/metrics");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            "discountCodesAvailable": [],
            "discountCodesUsed": ["DUMMY100"],
            "totalDiscountAmount": 3,
            "totalItemsPurchased": 2,
            "totalPurchaseAmount": 90,
        });
    });

    it("should return proper data when purchased orders are non empty and discount codes are added", async () => {
        PURCHASED_ORDERS.push({
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
        });
        PURCHASED_ORDERS.push({
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
        });

        DISCOUNT_CODES["DISCOUNT10"] = { type: "percentage", amount: 10 };
        const response = await request(app).get("/api/admin/metrics");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            "discountCodesAvailable": ["DISCOUNT10"],
            "discountCodesUsed": ["DUMMY100"],
            "totalDiscountAmount": 3,
            "totalItemsPurchased": 2,
            "totalPurchaseAmount": 90,
        });
    });
});

describe("POST /discountCode", () => {
    let DISCOUNT_CODES: { [key: string]: { type: string; amount: number } };
    beforeEach(() => {
        DISCOUNT_CODES = require("../../constants/inMemoryDb").DISCOUNT_CODES;
        // Reset the DISCOUNT_CODES before each test
        for (const key in DISCOUNT_CODES) {
            delete DISCOUNT_CODES[key];
        }
    });

    it("should create a new discount code and return success", async () => {
        const requestBody = {
            code: "NEWCODE10",
            type: "percentage",
            amount: 10,
        };

        const response = await request(app)
            .post("/api/admin/discountCode")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(DISCOUNT_CODES["NEWCODE10"]).toEqual({
            type: "percentage",
            amount: 10,
        });
    });

    it("should return a validation error for invalid request data", async () => {
        const requestBody = {
            code: "NEWCODE10",
            type: "invalidType", // Invalid type
            amount: 10,
        };

        const response = await request(app)
            .post("/api/admin/discountCode")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
    });

    it("should return an error if the discount code already exists", async () => {
        // Prepopulate the DISCOUNT_CODES with an existing code
        DISCOUNT_CODES["EXISTINGCODE"] = { type: "fixed", amount: 5 };

        const requestBody = {
            code: "EXISTINGCODE",
            type: "percentage",
            amount: 10,
        };

        const response = await request(app)
            .post("/api/admin/discountCode")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "This discount code is already added."
        );
    });

    it("should return an error for invalid req body", async () => {
        // Prepopulate the DISCOUNT_CODES with an existing code
        const requestBody = {
            promoCode: "EXISTINGCODE",
            type: "percentage",
            amount: 10,
        };

        const response = await request(app)
            .post("/api/admin/discountCode")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
    });
});
