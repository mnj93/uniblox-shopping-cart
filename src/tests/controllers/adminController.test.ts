import { Request, Response, NextFunction } from "express";
import adminController from "../../controllers/adminController";
import { PURCHASED_ORDERS } from "../../constants/inMemoryDb";

describe("listOrders", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const listOrders = adminController.listOrders;

    beforeEach(() => {
        // reset mocks before each test
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        req = {};
        res = {
            status: statusMock,
        };
        next = jest.fn();

        // mock purchase orders data before each call
        PURCHASED_ORDERS.length = 0;
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
                "paidAmount": 30,
                "discountAmount": 0,
                "discountCode": null,
                "items": [
                    {
                        "productId": 1,
                        "quantity": 3,
                        "price": 10,
                    },
                ],
            }
        );
    });

    it("should return 200 and the list of purchased orders", () => {
        listOrders(req as Request, res as Response, next as NextFunction);
        console.log("PURCHASED_ORDERS : ", PURCHASED_ORDERS);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            success: true,
            data: PURCHASED_ORDERS,
        });
    });

    it("should handle errors and return 400 with an error message", () => {
        console.log("reached here1");
        const error = new Error("Application error");
        // mock the next to throw an error
        const next = jest.fn(() => {
            throw error;
        });

        try {
            console.log("reached in try");
            listOrders(req as Request, res as Response, next as NextFunction);
        } catch (err: any) {
            console.log("reached in catch");
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                success: false,
                message: "Application error",
            });
        }
    });
});
