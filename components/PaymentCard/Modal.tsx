import { Course } from '@/utils/types/course'
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
}: {
  course: Course | null
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [paymentType, setPaymentType] = useState<'pix' | 'boleto' | null>(null)

  useEffect(() => setOpen(!!course), [course])

  if (!open || !course) {
    if (typeof window !== 'undefined') {
      document.body.style.overflowY = 'auto'
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
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setLoading(false)

    toast('Inscrição realizada com sucesso', {
      position: 'bottom-right',
      description: (
        <span className="text-green-500">
          Pagamento selecionado: {paymentType === 'pix' ? 'Pix' : 'Boleto'}
        </span>
      ),
    })

    onClose()
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
