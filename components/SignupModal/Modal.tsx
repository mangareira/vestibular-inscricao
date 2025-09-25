import { Course } from '@/utils/types/course'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { FormField } from '../ui/formField'
import { Separator } from '../ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Label } from '../ui/label'
import states from '@/utils/constants/country'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import singUpSchema, { SignUpForm } from '@/utils/schemas/signup.schema'
import { withMask } from 'use-mask-input'

export default function SignupModal({
  course,
  onClose,
}: {
  course: Course | null
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, control } = useForm<SignUpForm>({
    resolver: zodResolver(singUpSchema),
    defaultValues: {
      cpf: '',
      rg: '',
      phone: '',
      cep: '',
    },
  })

  useEffect(() => setOpen(!!course), [course])

  if (!open || !course) {
    if (typeof window !== 'undefined') {
      document.body.style.overflowY = 'auto'
    }

    return null
  }
  document.body.style.overflowY = 'hidden'

  const onSubmit = (data: SignUpForm) => {
    //Logica de submit
    console.log('✅ Cadastro:', data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <Card className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-start justify-between gap-4">
            <div className="text-xl font-semibold">Inscrição — {course.title}</div>
            <Button onClick={onClose} className="bg-white text-slate-500 hover:bg-gray-100">
              Fechar
            </Button>
          </CardTitle>
          <CardDescription>Preencha os dados para realizar a inscrição.</CardDescription>
        </CardHeader>
        <CardContent className="mb-2 max-h-[70vh] overflow-y-auto">
          <form
            className="grid grid-cols-1 gap-4"
            onSubmit={handleSubmit(onSubmit)}
            id="signup-form"
          >
            <div className="flex w-full flex-col">
              <Label className="text-muted-foreground text-lg">Informações Pessoais</Label>
              <Separator className="my-4" />
            </div>
            <FormField label="Nome completo" required {...register('name')} />
            <FormField label="Nome do Pai" required {...register('fatherName')} />
            <FormField label="Nome da Mãe" required {...register('motherName')} />

            <FormField label="Ensino Médio" required>
              <Controller
                name="highSchoolType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo de Escola</SelectLabel>
                        <SelectItem value="private">Privada</SelectItem>
                        <SelectItem value="public">Pública</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Ano de formação" required {...register('graduationYear')} />

            <FormField label="Cor e Raça/Etnia" required>
              <Controller
                name="ethnicity"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo de Etnia</SelectLabel>
                        <SelectItem value="pardo">Pardo</SelectItem>
                        <SelectItem value="negro">Negro</SelectItem>
                        <SelectItem value="branco">Branco</SelectItem>
                        <SelectItem value="amarela">Amarela</SelectItem>
                        <SelectItem value="indigena">Indígena</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <div className="flex w-full flex-col">
              <Label className="text-muted-foreground text-lg">Informações de Saúde</Label>
              <Separator className="my-4" />
            </div>

            <FormField label="Deficiência">
              <Controller
                name="disability"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo de Deficiências</SelectLabel>
                        <SelectItem value="transtorno_global_do_desenvolvimento">
                          Transtorno global do desenvolvimento
                        </SelectItem>
                        <SelectItem value="transtorno_do_expectro_autista">
                          Transtorno do Expectro Autista
                        </SelectItem>
                        <SelectItem value="deficiencia_visual">Deficiência Visual</SelectItem>
                        <SelectItem value="deficiencia_motora">Deficiência Motora</SelectItem>
                        <SelectItem value="deficiencia_auditiva">Deficiência Auditiva</SelectItem>
                        <SelectItem value="paralisia_cerebral">Paralisia Cerebral</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <div className="flex w-full flex-col">
              <Label className="text-muted-foreground text-lg">Informações Adcionais</Label>
              <Separator className="my-4" />
            </div>

            <FormField label="RG" required>
              <Controller
                control={control}
                name="rg"
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="12345678901-2"
                    onChange={field.onChange}
                    value={field.value}
                    ref={(el) => {
                      if (el) {
                        withMask('99999999999999-9', {
                          showMaskOnHover: false,
                        })(el)
                      }
                    }}
                  />
                )}
              />
            </FormField>
            <FormField label="CPF" required>
              <Controller
                name="cpf"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="123.456.789-01"
                    onChange={field.onChange}
                    value={field.value}
                    ref={(el) => {
                      if (el) {
                        withMask('999.999.999-99', {
                          showMaskOnHover: false,
                        })(el)
                      }
                    }}
                  />
                )}
              />
            </FormField>
            <FormField label="Telefone" required>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="(99) 99999-9999"
                    onChange={field.onChange}
                    value={field.value}
                    ref={(el) => {
                      if (el) {
                        withMask('(99) 99999-9999', {
                          showMaskOnHover: false,
                        })(el)
                      }
                    }}
                  />
                )}
              />
            </FormField>

            <div className="flex w-full flex-col">
              <Label className="text-muted-foreground text-lg">Endereço</Label>
              <Separator className="my-4" />
            </div>

            <FormField label="CEP" required>
              <Controller
                control={control}
                name="cep"
                render={({ field }) => (
                  <Input
                    type="text"
                    placeholder="99999-999"
                    onChange={field.onChange}
                    value={field.value}
                    ref={(el) => {
                      if (el) {
                        withMask('99999-999', {
                          showMaskOnHover: false,
                        })(el)
                      }
                    }}
                  />
                )}
              />
            </FormField>
            <FormField label="Logradouro" required {...register('street')} />
            <FormField label="N°" required {...register('number')} />
            <FormField label="Complemento" {...register('complement')} />
            <FormField label="Bairro" required {...register('district')} />
            <FormField label="Cidade" required {...register('city')} />

            {/* UF */}
            <FormField label="UF" required>
              <Controller
                name="uf"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Estados</SelectLabel>
                        {states.map((s) => (
                          <SelectItem value={s.uf} key={s.uf}>
                            {s.name} ({s.uf})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <div className="flex w-full flex-col">
              <Label className="text-muted-foreground text-lg">Dados de Acesso</Label>
              <Separator className="my-4" />
            </div>
            <FormField label="Email" type="email" required {...register('email')} />
            <FormField label="Senha" type="password" required {...register('password')} />
            <FormField
              label="Confirma Senha"
              type="password"
              required
              {...register('confirmPassword')}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button onClick={onClose} className="rounded-md border bg-white px-4 py-2 text-slate-500">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="signup-form"
            className="rounded-md bg-emerald-600 px-4 py-2 text-white"
          >
            Enviar inscrição
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
