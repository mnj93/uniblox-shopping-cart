import { Request, Response, NextFunction } from "express";
import adminController from "../../controllers/adminController";
import { PURCHASED_ORDERS } from "../../constants/inMemoryDb";
import adminService from "../../services/adminService";
import { GenerateCodeInput } from "../../schemas/adminSchema";

jest.mock("../../services/adminService");

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
        // console.log("PURCHASED_ORDERS : ", PURCHASED_ORDERS);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            success: true,
            data: PURCHASED_ORDERS,
        });
    });

    it("should handle errors and return 400 with an error message", () => {
        const error = new Error("Application error");
        statusMock.mockImplementationOnce(() => {
            throw error;
        });

        listOrders(req as Request, res as Response, next as NextFunction);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Application error",
        });
    });
});

describe("fetchDataMetrics", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const fetchAdminDataController = adminController.fetchDataMetrics;

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
        const mockData = { metric1: 100, metric2: 200 };
        (adminService.fetchAdminData as jest.Mock).mockReturnValue(mockData);
        fetchAdminDataController(
            req as Request,
            res as Response,
            next as NextFunction
        );
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            success: true,
            data: mockData,
        });
    });

    it("should handle errors and return 400 with custom error message", () => {
        const error = new Error("Application error");
        // mock the admin service to throw an error
        (adminService.fetchAdminData as jest.Mock).mockImplementation(() => {
            throw error;
        });

        fetchAdminDataController(
            req as Request,
            res as Response,
            next as NextFunction
        );

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Application error",
        });
    });

    it("should handle errors and return 400 with default error message", () => {
        // mock the admin service to throw an error
        (adminService.fetchAdminData as jest.Mock).mockImplementation(() => {
            throw new Error();
        });

        fetchAdminDataController(
            req as Request,
            res as Response,
            next as NextFunction
        );

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error.",
        });
    });
});

describe("generateDiscountCodes", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const generateDiscountCodes = adminController.generateDiscountCodes;

    beforeEach(() => {
        req = {
            body: {
                code: "DUMMY10",
                type: "percentage",
                amount: 10,
            } as GenerateCodeInput,
        };
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = { status: statusMock };
        next = jest.fn();
    });

    it("should generate discount codes and return 200 with the data", () => {
        const mockData = {
            "DUMMY100": {
                "type": "percentage",
                "amount": 10,
            },
            "DUMMY10": {
                "type": "percentage",
                "amount": 10,
            },
        };

        // mock the generateDiscountCodes method to return mock data
        (adminService.generateDiscountCodes as jest.Mock).mockReturnValue(
            mockData
        );

        generateDiscountCodes(
            req as Request,
            res as Response,
            next as NextFunction
        );

        expect(adminService.generateDiscountCodes).toHaveBeenCalledWith(
            req.body
        );
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            success: true,
            data: mockData,
        });
    });

    it("should handle errors and return 400 with an error message", () => {
        const errorMessage = "Application error";
        const error = new Error(errorMessage);

        // mock the generateDiscountCodes method to throw an error
        (adminService.generateDiscountCodes as jest.Mock).mockImplementation(
            () => {
                throw error;
            }
        );

        generateDiscountCodes(
            req as Request,
            res as Response,
            next as NextFunction
        );

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: errorMessage,
        });
    });

    it("should handle errors and return 400 with the default error message", () => {
        // mock the generateDiscountCodes method to throw a generic error (without a message)
        (adminService.generateDiscountCodes as jest.Mock).mockImplementation(
            () => {
                throw new Error();
            }
        );

        generateDiscountCodes(
            req as Request,
            res as Response,
            next as NextFunction
        );

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error.",
        });
    });
});