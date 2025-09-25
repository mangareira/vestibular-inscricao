import z from "zod";

const signUpSchema = z.object({
  // Informações pessoais
  name: z
    .string()
    .min(3, { message: "O nome completo deve ter pelo menos 3 caracteres" }),
  fatherName: z
    .string()
    .min(3, { message: "O nome do pai deve ter pelo menos 3 caracteres" }),
  motherName: z
    .string()
    .min(3, { message: "O nome da mãe deve ter pelo menos 3 caracteres" }),
  highSchoolType: z.enum(["private", "public"], {
    error: "Selecione o tipo de escola",
  }),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, { message: "Ano de formação inválido" }),
  ethnicity: z.enum(["pardo", "negro", "branco", "amarela", "indigena"], {
    error: "Selecione a etnia"
  }),

  // Informações de saúde
  disability: z
    .enum([
      "transtorno_global_do_desenvolvimento",
      "transtorno_do_expectro_autista",
      "deficiencia_visual",
      "deficiencia_motora",
      "deficiencia_auditiva",
      "paralisia_cerebral",
    ])
    .optional(),

  // Informações adicionais
  rg: z
    .string()
    .min(5, { message: "RG inválido" }),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: "CPF inválido" }),
  phone: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, { message: "Telefone inválido" }),

  // Endereço
  cep: z
    .string()
    .regex(/^\d{5}-\d{3}$/, { message: "CEP inválido" }),
  street: z
    .string()
    .min(3, { message: "Logradouro obrigatório" }),
  number: z
    .string()
    .min(1, { message: "Número obrigatório" }),
  complement: z.string().optional(),
  district: z
    .string()
    .min(2, { message: "Bairro obrigatório" }),
  city: z
    .string()
    .min(2, { message: "Cidade obrigatória" }),
  uf: z
    .string()
    .length(2, { message: "Selecione um estado válido" }),

  // Dados de acesso
  email: z
    .string()
    .email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type SignUpForm = z.infer<typeof signUpSchema>;
export default signUpSchema;
