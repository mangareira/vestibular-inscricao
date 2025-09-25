import z from "zod";

const loginSchema = z.object({
  email: z.email({error: "Email invalido"}),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
})

export type LoginForm = z.infer<typeof loginSchema>;
export default loginSchema;
