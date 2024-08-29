import { string, z } from "zod";
import { DISCOUNT_CODE_MIN_LENGTH } from "../constants/index";

export const generateCodeSchema = z.object({
    code: z
        .string()
        .min(DISCOUNT_CODE_MIN_LENGTH, {
            message: `Min length should be ${DISCOUNT_CODE_MIN_LENGTH} for discount code.`,
        })
        .regex(/^[a-zA-Z0-9]*$/, {
            message: "The code must be alphanumeric",
        }),
    type: z.enum(["percentage", "fixed"]),
    amount: z.number().positive(),
});

export type GenerateCodeInput = z.infer<typeof generateCodeSchema>;
