import request from "supertest";
import app from "../../app";

// Mocking the cart array
jest.mock("../../constants/inMemoryDb", () => {
    return {
        CART: [],
        PRODUCTS: [
            {
                "brand": "Essence",
                "category": "beauty",
                "description":
                    "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
                "id": 1,
                "price": 10,
                "sku": "RCH45Q1A",
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
                "title": "Essence Mascara Lash Princess",
            },
            {
                "brand": "Glamour Beauty",
                "category": "beauty",
                "description":
                    "The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it's convenient for on-the-go makeup application.",
                "id": 2,
                "price": 20,
                "sku": "MVCFH27F",
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/thumbnail.png",
                "title": "Eyeshadow Palette with Mirror",
            },
            {
                "brand": "Velvet Touch",
                "category": "beauty",
                "description":
                    "The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.",
                "id": 3,
                "price": 15,
                "sku": "9EN8WLT2",
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/beauty/Powder%20Canister/thumbnail.png",
                "title": "Powder Canister",
            },
            {
                "brand": "Chic Cosmetics",
                "category": "beauty",
                "description":
                    "The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.",
                "id": 4,
                "price": 13,
                "sku": "O5IF1NTA",
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/beauty/Red%20Lipstick/thumbnail.png",
                "title": "Red Lipstick",
            },
            {
                "brand": "Nail Couture",
                "category": "beauty",
                "description":
                    "The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.",
                "id": 5,
                "price": 9,
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/beauty/Red%20Nail%20Polish/thumbnail.png",
                "title": "Red Nail Polish",
            },
        ],
        PURCHASED_ORDERS: [],
        DISCOUNT_CODES: {},
    };
});

describe("GET /cart", () => {
    let CART: any[];
    beforeEach(() => {
        CART = require("../../constants/inMemoryDb").CART;
        // Reset the CART before each test
        CART.length = 0;
    });

    it("should return an empty cart when no items are present", async () => {
        const response = await request(app).get("/api/cart");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]); // Expecting an empty array
    });

    it("should return a list of items in the cart", async () => {
        // update the CART array for this test case
        CART.push({
            productId: 1,
            quantity: 2,
            price: 100,
        });
        CART.push({
            productId: 2,
            quantity: 1,
            price: 200,
        });

        const response = await request(app).get("/api/cart");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([
            { productId: 1, quantity: 2, price: 100 },
            { productId: 2, quantity: 1, price: 200 },
        ]);
    });
});

describe("POST /cart", () => {
    let CART: any[];
    beforeEach(() => {
        CART = require("../../constants/inMemoryDb").CART;
        // Reset the CART before each test
        CART.length = 0;
    });

    it("should add an item to the cart when valid data is provided", async () => {
        const requestBody = {
            productId: 1,
            quantity: 2,
        };

        const response = await request(app)
            .post("/api/cart")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(CART).toEqual([{ productId: 1, quantity: 2, price: 10 }]);
    });

    it("should fail for invalid request data structure", async () => {
        const requestBody = {
            id: 1,
            quantity: 2,
        };

        const response = await request(app)
            .post("/api/cart")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
    });

    it("should fail for negative quantity", async () => {
        const requestBody = {
            productId: 1,
            quantity: -2,
        };

        const response = await request(app)
            .post("/api/cart")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual([
            { path: "quantity", message: "Number must be greater than 0" },
        ]);
    });

    it("should fail for 0 quantity", async () => {
        const requestBody = {
            productId: 1,
            quantity: 0,
        };

        const response = await request(app)
            .post("/api/cart")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual([
            { path: "quantity", message: "Number must be greater than 0" },
        ]);
    });

    it("should fail invalid product id", async () => {
        const requestBody = {
            productId: 100,
            quantity: 1,
        };

        const response = await request(app)
            .post("/api/cart")
            .send(requestBody)
            .expect("Content-Type", /json/);

        console.log("response.body.message : ", response.body.message);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual("Invalid product id.");
    });

    it("should update the quantity if the product already exists in the cart", async () => {
        // add to cart
        CART.push({
            productId: 1,
            quantity: 1,
            price: 100,
        });

        const requestBody = {
            productId: 1,
            quantity: 2,
        };

        const response = await request(app)
            .post("/api/cart")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(CART).toEqual([
            { productId: 1, quantity: 3, price: 100 }, // Updated quantity
        ]);
    });

    it("should add item to non empty cart", async () => {
        // add to cart
        CART.push({
            productId: 1,
            quantity: 1,
            price: 10,
        });

        const requestBody = {
            productId: 2,
            quantity: 2,
        };

        const response = await request(app)
            .post("/api/cart")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(CART).toEqual([
            { productId: 1, quantity: 1, price: 10 },
            { productId: 2, quantity: 2, price: 20 },
        ]);
    });
});

describe("POST /cart/checkout", () => {
    let CART: any[];
    let PURCHASED_ORDERS: any[];
    let DISCOUNT_CODES: { [key: string]: { type: string; amount: number } };
    beforeEach(() => {
        CART = require("../../constants/inMemoryDb").CART;
        PURCHASED_ORDERS =
            require("../../constants/inMemoryDb").PURCHASED_ORDERS;
        DISCOUNT_CODES = require("../../constants/inMemoryDb").DISCOUNT_CODES;
        // Reset the DISCOUNT_CODES before each test
        for (const key in DISCOUNT_CODES) {
            delete DISCOUNT_CODES[key];
        }
        // Reset the data before each test
        CART.length = 0;
        PURCHASED_ORDERS.length = 0;
    });

    it("should return an error when cart is empty", async () => {
        const requestBody = {};

        const response = await request(app)
            .post("/api/cart/checkout")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual("Cart is empty.");
    });

    it("should success for valid cart item", async () => {
        CART.push({
            productId: 1,
            quantity: 2,
            price: 100,
        });
        CART.push({
            productId: 2,
            quantity: 1,
            price: 200,
        });

        const requestBody = {};

        const response = await request(app)
            .post("/api/cart/checkout")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(1);

        expect(response.body.data).toEqual([
            {
                orderTotal: 400,
                paidAmount: 400,
                discountAmount: 0,
                discountCode: null,
                items: [
                    {
                        productId: 1,
                        quantity: 2,
                        price: 100,
                    },
                    {
                        productId: 2,
                        quantity: 1,
                        price: 200,
                    },
                ],
            },
        ]);
    });

    it("should fail for invalid discount code", async () => {
        CART.push({
            productId: 1,
            quantity: 2,
            price: 100,
        });
        CART.push({
            productId: 2,
            quantity: 1,
            price: 200,
        });

        // add a discount code
        DISCOUNT_CODES["DISCOUNT10"] = { type: "percentage", amount: 10 };

        const requestBody = { code: "INVALID" };

        const response = await request(app)
            .post("/api/cart/checkout")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual("Invalid discount code.");
    });

    it("should fail for valid discount code and inelgible order", async () => {
        // nth order value is 2 so it should fail for first order
        CART.push({
            productId: 1,
            quantity: 2,
            price: 100,
        });
        CART.push({
            productId: 2,
            quantity: 1,
            price: 200,
        });

        // add a discount code
        DISCOUNT_CODES["DISCOUNT10"] = { type: "percentage", amount: 10 };

        const requestBody = { code: "DISCOUNT10" };

        const response = await request(app)
            .post("/api/cart/checkout")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toEqual(
            "You're not eligible to use the discount code."
        );
    });

    it("should success for valid discount code and nth order", async () => {
        // nth order value is 2 so it should work for second order

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

        CART.push({
            productId: 1,
            quantity: 2,
            price: 100,
        });
        CART.push({
            productId: 2,
            quantity: 1,
            price: 200,
        });

        // add a discount code
        DISCOUNT_CODES["DISCOUNT10"] = { type: "percentage", amount: 10 };

        const requestBody = { code: "DISCOUNT10" };

        const response = await request(app)
            .post("/api/cart/checkout")
            .send(requestBody)
            .expect("Content-Type", /json/);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        const lastPlacedOrder = response.body.data[1];

        expect(lastPlacedOrder.discountAmount).toBe(40);
        expect(lastPlacedOrder.orderTotal).toBe(400);
        expect(lastPlacedOrder.paidAmount).toBe(360);
        expect(lastPlacedOrder.discountCode).toBe("DISCOUNT10");

        // cart should be empty
        expect(CART.length).toBe(0);
        // discount code should be removed
        expect(DISCOUNT_CODES["DISCOUNT10"]).toBeUndefined();

        // purchased orders should be updated
        expect(PURCHASED_ORDERS.length).toBe(2);
    });
});

describe("GET /cart/discountCodes", () => {
    let DISCOUNT_CODES: { [key: string]: { type: string; amount: number } };
    beforeEach(() => {
        DISCOUNT_CODES = require("../../constants/inMemoryDb").DISCOUNT_CODES;
        // Reset the DISCOUNT_CODES before each test
        for (const key in DISCOUNT_CODES) {
            delete DISCOUNT_CODES[key];
        }
    });

    it("should return an empty array when discount codes are not added", async () => {
        const response = await request(app).get("/api/cart/discountCodes");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual([]); // Expecting an empty array
    });

    it("should return a list of discount codes added", async () => {
        // add discount codes

        DISCOUNT_CODES["DISCOUNT1"] = { type: "percentage", amount: 10 };
        DISCOUNT_CODES["DISCOUNT2"] = { type: "percentage", amount: 20 };

        const response = await request(app).get("/api/cart/discountCodes");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual(["DISCOUNT1", "DISCOUNT2"]);
    });
});
