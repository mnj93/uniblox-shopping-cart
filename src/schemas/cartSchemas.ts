import { z } from "zod";

export const addToCartSchema = z.object({
    productId: z.number().positive(),
    quantity: z.number().positive(),
});

export type AddToCardInput = z.infer<typeof addToCartSchema>;
