import * as z from "zod";


export const signUpSchema = z.object({
  name: z
    .string({ error: "Name is required" }).trim().min(2),
  email: z
    .string({ error: "Email is required" }).trim().toLowerCase()
    .pipe(z.email({ error: "A valid email is required" })),
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(128, { error: "Password must be at most 128 characters" })
});

export type SignUpPayload = z.infer<typeof signUpSchema>;
