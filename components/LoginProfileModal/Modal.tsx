'use client'

import { useState } from 'react'
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { FormField } from '../ui/formField'
import loginSchema, { LoginForm } from '@/utils/schemas/login.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { client } from '@/lib/hono'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function LoginProfileModal({
  onClose,
  setLoginProfile,
  setIsLogin,
  subscribeProfile,
}: {
  onClose: () => void
  setLoginProfile: (open: boolean) => void
  setIsLogin: (val: boolean) => void
  subscribeProfile: () => void
}) {
  const [isLoading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const { register, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  if (open) {
    if (typeof window !== 'undefined') {
      document.body.style.overflowY = 'scroll'
    }
    return null
  } else {
    document.body.style.overflowY = 'hidden'
  }

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)

    const res = await client.api.profile.login.$post({ json: data })
    const json = await res.json()

    if (res.status !== 200) {
      setLoading(false)
      return toast('Erro no login', {
        position: 'top-right',
        description: <span className="text-red-500">{json.message}</span>,
      })
    }

    toast.success('Login realizado com sucesso!')
    setOpen(true)
    setLoading(false)
    setLoginProfile(false)
    setIsLogin(true)
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="text-xl font-semibold">Entrar no Perfil</div>
          <Button onClick={onClose} className="bg-white text-slate-500 hover:bg-gray-100">
            Fechar
          </Button>
        </CardTitle>
        <CardDescription>Acesse sua conta para continuar</CardDescription>
      </CardHeader>

      <CardContent className="max-h-[70vh] overflow-y-auto">
        <form
          className="grid grid-cols-1 gap-4"
          onSubmit={handleSubmit(onSubmit)}
          id="login-profile-form"
        >
          <FormField label="Email" type="email" required {...register('email')} />
          <FormField label="Senha" type="password" required {...register('password')} />
        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        <span
          className="cursor-pointer text-sm text-slate-400 hover:text-slate-800"
          onClick={subscribeProfile}
        >
          Nâo possui cadastro! Se inscreva.
        </span>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className="border bg-white text-slate-500 hover:bg-gray-100">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="login-profile-form"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
          </Button>
        </div>
      </CardFooter>
    </>
  )
}
