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
            {
                "brand": "Calvin Klein",
                "category": "fragrances",
                "description":
                    "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.",
                "id": 6,
                "price": 50,
                "sku": "DZM2JQZE",
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/fragrances/Calvin%20Klein%20CK%20One/thumbnail.png",
                "title": "Calvin Klein CK One",
            },
            {
                "brand": "Chanel",
                "category": "fragrances",
                "description":
                    "Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.",
                "id": 7,
                "price": 130,
                "sku": "K71HBCGS",
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/thumbnail.png",
                "title": "Chanel Coco Noir Eau De",
            },
            {
                "brand": "Dior",
                "category": "fragrances",
                "description":
                    "J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.",
                "id": 8,
                "price": 90,
                "sku": "E70NB03B",
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/fragrances/Dior%20J'adore/thumbnail.png",
                "title": "Dior J'adore",
            },
            {
                "brand": "Dolce & Gabbana",
                "category": "fragrances",
                "description":
                    "Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.",
                "id": 9,
                "price": 70,
                "sku": "1NBFK980",
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/fragrances/Dolce%20Shine%20Eau%20de/thumbnail.png",
                "title": "Dolce Shine Eau de",
            },
            {
                "brand": "Gucci",
                "category": "fragrances",
                "description":
                    "Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.",
                "id": 10,
                "price": 80,
                "sku": "FFKZ6HOF",
                "thumbnail":
                    "https://cdn.dummyjson.com/products/images/fragrances/Gucci%20Bloom%20Eau%20de/thumbnail.png",
                "title": "Gucci Bloom Eau de",
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
