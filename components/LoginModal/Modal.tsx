import { Course } from '@/utils/types/course'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { FormField } from '../ui/formField'
import loginSchema, { LoginForm } from '@/utils/schemas/login.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'

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

  const onSubmit = (data: LoginForm) => {
    console.log(data)
  }

  return (
    <AnimatePresence>
      {open && course && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

          <motion.div
            key="login"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative z-10 w-full max-w-xl"
          >
            <Card className="rounded-2xl bg-white p-6 shadow-2xl">
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
                <form
                  className="grid grid-cols-1 gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                  id="login-form"
                >
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
                  <Button
                    onClick={onClose}
                    className="rounded-md border bg-white px-4 py-2 text-slate-500"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    form="login-form"
                    className="rounded-md bg-emerald-600 px-4 py-2 text-white"
                  >
                    Login
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
