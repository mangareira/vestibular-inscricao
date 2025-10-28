import { Course } from '@/utils/types/course'
import { Course as TypeCourse } from '@/app/generated/prisma'
import { useState, useEffect } from 'react'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { client } from '@/lib/hono'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { PaymentTypeCard } from '../ui/payment-card'

export default function PaymentCardModal({
  course,
  onClose,
  setPayment,
}: {
  course: Course | null
  onClose: () => void
  setPayment: (course: TypeCourse) => void
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [paymentType, setPaymentType] = useState<'pix' | 'boleto' | null>(null)

  useEffect(() => setOpen(!!course), [course])

  if (!open || !course) {
    if (typeof window !== 'undefined') {
      document.body.style.overflowY = 'scroll'
    }
    return null
  }
  document.body.style.overflowY = 'hidden'

  const onSubmit = async () => {
    if (!paymentType) {
      return toast('Selecione um método de pagamento', {
        position: 'bottom-right',
        description: <span className="text-yellow-500">Escolha Pix ou Boleto para continuar.</span>,
      })
    }

    setLoading(true)
    const res = await client.api.payment.create.$post({
      json: { paymentForm: paymentType, course_name: course.title },
      cookie: {
        id: document.cookie.split(';')[0].split('=')[1],
      },
    })
    const json = await res.json()
    setLoading(false)

    if (res.status !== 201) {
      return toast('Erro na criação do pagamento', {
        position: 'top-right',
        description: <span className="text-red-500">{json.message}</span>,
      })
    }
    if ('course' in json) {
      // Aqui o TypeScript sabe que é o tipo de sucesso
      // Normaliza as datas (string -> Date) antes de passar para setPayment
      const serverCourse = json.course
      const normalizedCourse: TypeCourse = {
        ...serverCourse,
        createdAt: new Date(serverCourse.createdAt),
        updatedAt: new Date(serverCourse.updatedAt),
      }
      setPayment(normalizedCourse) // Passa o course para setPayment
      toast('Pagamento criado com sucesso', {
        position: 'bottom-right',
        description: (
          <span className="text-green-500">
            Pagamento selecionado: {paymentType === 'pix' ? 'Pix' : 'Boleto'}
          </span>
        ),
      })
    } else {
      // Fallback caso a resposta não tenha a estrutura esperada
      toast('Resposta inesperada do servidor', {
        position: 'top-right',
        description: <span className="text-red-500">Estrutura de resposta inválida</span>,
      })
    }
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
        <CardDescription>Escolha o tipo de pagamento desejado:</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row space-x-3">
        <PaymentTypeCard
          title="Pix"
          description="Pagamento instantâneo via QR Code"
          selected={paymentType === 'pix'}
          onSelect={() => setPaymentType('pix')}
          price={course.price}
        />
        <PaymentTypeCard
          title="Boleto Bancário"
          description="Pagamento por código de barras"
          selected={paymentType === 'boleto'}
          onSelect={() => setPaymentType('boleto')}
          price={course.price}
        />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button onClick={onClose} className="rounded-md border bg-white px-4 py-2 text-slate-500">
          Cancelar
        </Button>
        <Button
          type="submit"
          form="login-form"
          className={`rounded-md bg-emerald-600 px-4 py-2 text-white ${isLoading ? 'bg-green-300' : null}`}
          disabled={isLoading}
          onClick={onSubmit}
        >
          {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Inscrever-se'}
        </Button>
      </CardFooter>
    </>
  )
}
