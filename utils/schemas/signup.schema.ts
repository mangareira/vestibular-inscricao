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

  rg: z
    .string()
    .min(5, { message: "RG inválido" })
    .refine((val) => {
      const digits = val.replace(/\D/g, '')
      return digits.length >= 13 && digits.length <= 15
    }, { message: 'RG inválido' }),
  cpf: z
    .string()
    .refine((val) => {
      const digits = val.replace(/\D/g, '')
      if (!/^\d{11}$/.test(digits)) return false

      const cpfNums = digits.split('').map((d) => parseInt(d, 10))
      const allEqual = cpfNums.every((n) => n === cpfNums[0])
      if (allEqual) return false

      const calcCheck = (slice: number) => {
        const factor = slice + 1
        let total = 0
        for (let i = 0; i < slice; i++) {
          total += cpfNums[i] * (factor - i)
        }
        const mod = (total * 10) % 11
        return mod === 10 ? 0 : mod
      }

      const d1 = calcCheck(9)
      const d2 = calcCheck(10)
      return d1 === cpfNums[9] && d2 === cpfNums[10]
    }, { message: 'CPF inválido' }),
  phone: z
    .string()
    .refine((val) => {
      const digits = val.replace(/\D/g, '')
      return digits.length === 10 || digits.length === 11 || (digits.startsWith('55') && (digits.length === 12 || digits.length === 13))
    }, { message: 'Telefone inválido' }),

  // Endereço
  cep: z
    .string()
    .refine((val) => {
      const digits = val.replace(/\D/g, '')
      return /^\d{8}$/.test(digits)
    }, { message: 'CEP inválido' }),
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
