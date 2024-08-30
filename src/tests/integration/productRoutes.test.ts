import request from "supertest";
import app from "../../app";

// Mock the products data
jest.mock("../../constants/products", () => {
    return {
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
        ],
    };
});

describe("GET /products", () => {
    it("should return a list of products with a 200 status", async () => {
        const response = await request(app).get("/api/products");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(2);

        // checks for the product data structure
        expect(response.body.data[0]).toHaveProperty("brand");
        expect(response.body.data[0]).toHaveProperty("category");
        expect(response.body.data[0]).toHaveProperty("id");
        expect(response.body.data[0]).toHaveProperty("price");
        expect(response.body.data[0]).toHaveProperty("sku");
    });
});
