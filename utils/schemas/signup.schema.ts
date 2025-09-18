import z from "zod";

const singUpSchema = z.object({
  name: z.string(),
  cpf: z.string()
})

export type SignUpForm = z.infer<typeof singUpSchema>
export default singUpSchema