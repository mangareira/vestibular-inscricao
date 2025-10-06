import { Course } from '@/utils/types/course'
import { useState, useEffect } from 'react'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { FormField } from '../ui/formField'
import loginSchema, { LoginForm } from '@/utils/schemas/login.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { client } from '@/lib/hono'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function LoginModal({
  course,
  onClose,
  isSubscribe,
}: {
  course: Course | null
  onClose: () => void
  isSubscribe: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  useEffect(() => setOpen(!!course), [course])

  if (!open || !course) {
    if (typeof window !== 'undefined') {
      document.body.style.overflowY = 'auto'
    }
    return null
  }
  document.body.style.overflowY = 'hidden'

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

    setLoading(false)
    onClose()
    return toast('Login realizado com sucesso', {
      position: 'top-right',
      description: <span className="text-green-500">{json.message}</span>,
    })
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-start justify-between gap-4">
          <div className="text-xl font-semibold">Inscrição — {course.title}</div>
          <Button onClick={onClose} className="bg-white text-slate-500 hover:bg-gray-100">
            Fechar
          </Button>
        </CardTitle>
        <CardDescription>Faça o login para ir na inscrição.</CardDescription>
      </CardHeader>
      <CardContent className="mb-2 max-h-[70vh] overflow-y-auto">
        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)} id="login-form">
          <FormField label="Email" type="email" required {...register('email')} />
          <FormField label="Senha" type="password" required {...register('password')} />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <span
          className="cursor-pointer text-sm text-slate-400 hover:text-slate-800"
          onClick={isSubscribe}
        >
          Nâo possui cadastro! Se inscreva.
        </span>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} className="rounded-md border bg-white px-4 py-2 text-slate-500">
            Cancelar
          </Button>
          <Button
            type="submit"
            form="login-form"
            className={`rounded-md bg-emerald-600 px-4 py-2 text-white ${isLoading ? 'bg-green-300' : null}`}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Login'}
          </Button>
        </div>
      </CardFooter>
    </>
  )
}
