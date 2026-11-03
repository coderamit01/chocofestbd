import * as z from "zod";

const emailSchema = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .pipe(z.email({ error: "A valid email is required" }));

export const signUpSchema = z.object({
  name: z
    .string({ error: "Name is required" }).trim().min(2),
  email: emailSchema,
  password: z
    .string({ error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters" })
    .max(128, { error: "Password must be at most 128 characters" })
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z
    .string({ error: "Password is required" })
    .min(1, { error: "Password is required" })
    .max(128, { error: "Password must be at most 128 characters" }),
  rememberMe: z.boolean().optional(),
});

export type SignUpPayload = z.infer<typeof signUpSchema>;
export type SignInPayload = z.infer<typeof signInSchema>;
