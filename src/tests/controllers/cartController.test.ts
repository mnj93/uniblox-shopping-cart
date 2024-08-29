import { Request, Response, NextFunction } from "express";
import cartController from "../../controllers/cartController";
import cartService from "../../services/cartService";
import { AddToCardInput } from "../../schemas/cartSchemas";
import { CART, PURCHASED_ORDERS } from "../../constants/inMemoryDb";

// mock the cart service
jest.mock("../../services/cartService");

describe("addToCart", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const addToCart = cartController.addToCart;

    beforeEach(() => {
        req = {
            body: {
                productId: 123,
                quantity: 2,
            } as AddToCardInput,
        };
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = { status: statusMock };
        next = jest.fn();

        // reset cart before each call
        CART.length = 0;
    });
    it("should sucess with valid data and return 200 with updated cart", () => {
        (cartService.processAddToCart as jest.Mock).mockImplementation(() => {
            CART.push(req.body);
        });

        addToCart(req as Request, res as Response, next as NextFunction);

        expect(cartService.processAddToCart).toHaveBeenCalledWith(req.body);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ success: true, data: CART });
    });

    it("should handle errors and return 400 with an error message", () => {
        const errorMessage = "Application error";
        const error = new Error(errorMessage);

        // mock the processAddToCart method to throw an error
        (cartService.processAddToCart as jest.Mock).mockImplementation(() => {
            throw error;
        });

        addToCart(req as Request, res as Response, next as NextFunction);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: errorMessage,
        });
    });

    it("should handle errors and return 400 with default error message", () => {
        // mock the processAddToCart method to throw an error
        (cartService.processAddToCart as jest.Mock).mockImplementation(() => {
            throw new Error();
        });

        addToCart(req as Request, res as Response, next as NextFunction);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error.",
        });
    });
});

describe("listCart", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const listCart = cartController.listCart;

    beforeEach(() => {
        req = {
            body: {
                productId: 123,
                quantity: 2,
            } as AddToCardInput,
        };
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = { status: statusMock };
        next = jest.fn();

        // reset cart before each call
        CART.length = 0;
        CART.push(
            {
                "productId": 1,
                "quantity": 3,
                "price": 10,
            },
            {
                "productId": 2,
                "quantity": 3,
                "price": 20,
            }
        );
    });
    it("should sucess with 200 and return cart data", () => {
        listCart(req as Request, res as Response, next as NextFunction);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({ success: true, data: CART });
    });

    it("should handle errors and return 400 with an error message", () => {
        const error = new Error("Application error");
        statusMock.mockImplementationOnce(() => {
            throw error;
        });

        listCart(req as Request, res as Response, next as NextFunction);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Application error",
        });
    });
});

describe("checkoutCart", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const checkoutCart = cartController.checkoutCart;

    beforeEach(() => {
        req = {
            body: {
                code: "DUMMY10",
            },
        };
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = { status: statusMock };
        next = jest.fn();
    });

    it("should process the checkout and return 200 with purchased orders", () => {
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
        );

        checkoutCart(req as Request, res as Response, next as NextFunction);

        expect(cartService.processCheckout).toHaveBeenCalledWith(req.body.code);
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            success: true,
            data: PURCHASED_ORDERS,
        });
        // reset PURCHASED_ORDERS
        PURCHASED_ORDERS.length = 0;
    });

    it("should handle errors and return 400 with an error message", () => {
        const errorMessage = "Application error";
        const error = new Error(errorMessage);

        // mock the processCheckout method to throw an error
        (cartService.processCheckout as jest.Mock).mockImplementation(() => {
            throw error;
        });

        checkoutCart(req as Request, res as Response, next as NextFunction);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: errorMessage,
        });
    });

    it("should handle errors and return 400 with the default error message", () => {
        // mock the processCheckout method to throw default error
        (cartService.processCheckout as jest.Mock).mockImplementation(() => {
            throw new Error();
        });
        checkoutCart(req as Request, res as Response, next as NextFunction);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error.",
        });
    });
});

describe("fetchEligibleDiscountCodes Controller", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: Partial<NextFunction>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;
    const fetchEligibleDiscountCodes =
        cartController.fetchEligibleDiscountCodes;

    beforeEach(() => {
        req = {};
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = { status: statusMock };
        next = jest.fn();
    });

    it("should fetch eligible discount codes and return 200 with the data", () => {
        const mockDiscountCodes = ["DUMMY10", "DUMMY100"];

        // mock the fetchEligibleDiscountCodes method
        (cartService.fetchEligibleDiscountCodes as jest.Mock).mockReturnValue(
            mockDiscountCodes
        );

        fetchEligibleDiscountCodes(
            req as Request,
            res as Response,
            next as NextFunction
        );

        expect(cartService.fetchEligibleDiscountCodes).toHaveBeenCalled();
        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith({
            success: true,
            data: mockDiscountCodes,
        });
    });

    it("should handle errors and return 400 with an error message", () => {
        const errorMessage = "Application error";
        const error = new Error(errorMessage);

        // mock the fetchEligibleDiscountCodes method to throw an error
        (
            cartService.fetchEligibleDiscountCodes as jest.Mock
        ).mockImplementation(() => {
            throw error;
        });

        fetchEligibleDiscountCodes(
            req as Request,
            res as Response,
            next as NextFunction
        );

        expect(cartService.fetchEligibleDiscountCodes).toHaveBeenCalled();
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: errorMessage,
        });
    });

    it("should handle errors and return 400 with the default error message", () => {
        // mock the fetchEligibleDiscountCodes method to throw a generic error (without a message)
        (
            cartService.fetchEligibleDiscountCodes as jest.Mock
        ).mockImplementation(() => {
            throw new Error();
        });

        fetchEligibleDiscountCodes(
            req as Request,
            res as Response,
            next as NextFunction
        );

        expect(cartService.fetchEligibleDiscountCodes).toHaveBeenCalled();
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error.",
        });
    });
});
