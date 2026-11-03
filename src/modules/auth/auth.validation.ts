import z from "zod";

export const signUpSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(100, { error: "Name must be at most 100 characters" }),
  email: z
    .string({ error: "Email is required" })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "A valid email is required" })),
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(128, { error: "Password must be at most 128 characters" }),
  phone: z
    .string({ error: "Phone number is required" })
    .regex(/^\+8801[3-9]\d{8}$/, { error: "Phone number must be in the format +8801XXXXXXXXX" }),
});

export type SignUpPayload = z.infer<typeof signUpSchema>;
