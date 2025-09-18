import { Course } from '@/utils/types/course'
import { useState, useEffect } from 'react'

export default function LoginModal({
  course,
  onClose,
}: {
  course: Course | null
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(!!course), [course])

  if (!open || !course) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">Inscrição — {course.title}</h3>
            <p className="text-muted-foreground text-sm">
              Preencha os dados para realizar a inscrição.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500">
            Fechar
          </button>
        </div>

        <form className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col">
            <span className="text-muted-foreground text-sm">Nome completo</span>
            <input className="mt-1 rounded-md border p-2" />
          </label>

          <label className="flex flex-col">
            <span className="text-muted-foreground text-sm">E-mail</span>
            <input className="mt-1 rounded-md border p-2" type="email" />
          </label>

          <label className="flex flex-col md:col-span-2">
            <span className="text-muted-foreground text-sm">Documento (CPF)</span>
            <input className="mt-1 rounded-md border p-2" />
          </label>

          <div className="mt-2 flex items-center justify-end gap-3 md:col-span-2">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">
              Cancelar
            </button>
            <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 text-white">
              Enviar inscrição
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
