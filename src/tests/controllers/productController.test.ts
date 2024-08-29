import { Request, Response, NextFunction } from "express";
import productController from "../../controllers/productController";
import { PRODUCTS } from "../../constants/products";

describe("listProducts", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const listProducts = productController.listProducts;

    beforeEach(() => {
        // reset mocks before each test
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        req = {};
        res = {
            status: statusMock,
        };
        next = jest.fn();
    });

    it("should return 200 and the list of purchased orders", () => {
        listProducts(req as Request, res as Response, next as NextFunction);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            success: true,
            data: PRODUCTS,
        });
    });
});
