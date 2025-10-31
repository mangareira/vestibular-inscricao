'use client'

import { useState, useEffect } from 'react'
import { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import type { Course } from '@/utils/types/course'
import type { Course as TypeCourse } from '@/app/generated/prisma'
import Image from 'next/image'
import { Copy, Loader2, TicketX } from 'lucide-react'
import { client } from '@/lib/hono'

export default function PaymentTypeModal({
  course,
  onClose,
  payment,
}: {
  course: Course | null
  payment: TypeCourse | null
  onClose: () => void
}) {
  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => setOpen(!!course), [course])

  if (!open || !course || !payment) {
    if (typeof window !== 'undefined') {
      document.body.style.overflowY = 'scroll'
    }
    return null
  }
  document.body.style.overflowY = 'hidden'

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(
        payment.identificationField ? payment.identificationField : payment.pixCopiaECola
      )
      toast.success(
        payment.identificationField
          ? 'Linha digitavel copiada com sucesso!'
          : 'Código Pix copiado com sucesso!'
      )
    } catch {
      toast.error(
        payment.identificationField ? 'Erro ao copiar linha digitavel' : 'Erro ao copiar Pix'
      )
    }
  }

  const cancelPix = async () => {
    setLoading(true)
    const res = await client.api.payment['delete-payment'][':id'].$delete({
      param: {
        id: payment.pixTransaction,
      },
      cookie: {
        id: document.cookie.split(';')[0].split('=')[1],
      },
    })

    const json = await res.json()
    setLoading(false)

    if (res.status !== 200) {
      return toast('Erro ao cancelar o pagamento', {
        position: 'top-right',
        description: <span className="text-red-500">{json.message}</span>,
      })
    }
    onClose()
    return toast('Pagamento cancelado com sucesso', {
      position: 'bottom-right',
    })
  }

  return (
    <>
      <CardHeader className="">
        <CardTitle className="flex items-start justify-between gap-4">
          <span className="text-xl font-semibold text-gray-800">Inscrição — {course.title}</span>
          <Button
            onClick={onClose}
            className="rounded-md border bg-white text-slate-500 hover:bg-gray-100"
          >
            Fechar
          </Button>
        </CardTitle>
        <CardDescription className="text-gray-600">
          {!payment.identificationField
            ? 'Finalize seu pagamento via Pix'
            : 'Finalize seu pagamento via Boleto'}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex max-h-[70vh] flex-col items-center gap-6 overflow-y-scroll py-6">
        {/* Pagamento Pix */}
        {!payment.identificationField && (
          <>
            <div className="rounded-lg border bg-gray-50 p-4 shadow-sm">
              <Image
                alt="qrcode"
                src={`data:image/png;base64,${payment.pixQrCodeId}`}
                width={220}
                height={220}
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="max-w-sm text-center text-sm break-all text-gray-700">
                {payment.pixCopiaECola}
              </p>
              <div className="flex flex-row gap-2">
                <Button
                  onClick={copyPix}
                  className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Copy className="h-4 w-4" />
                  Copiar código Pix
                </Button>
                <Button
                  onClick={cancelPix}
                  className={`flex items-center gap-2 bg-red-600 text-white ${isLoading ? 'bg-red-300' : 'hover:bg-red-700'}`}
                  disabled={isLoading}
                >
                  <TicketX className="h-4 w-4" />
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    'Cancelar pagamento'
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Pagamento Boleto */}
        {payment.identificationField && payment.bankSlipUrl && (
          <div className="flex w-full flex-col items-center gap-4">
            <p className="text-lg font-semibold text-gray-700">Linha Digitável</p>
            <p className="rounded-md bg-gray-100 px-4 py-2 font-mono text-sm break-all text-gray-800">
              {payment.identificationField}
            </p>

            {/* Botões */}
            <div className="flex items-center gap-3">
              <Button
                onClick={copyPix}
                className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Copy className="h-4 w-4" />
                Copiar linha digitável
              </Button>
            </div>

            {/* PDF do boleto (Asaas) */}
            <div className="mt-4 h-[600px] w-full overflow-hidden rounded-lg border shadow-inner">
              <iframe
                src={payment.bankSlipUrl}
                className="h-full w-full"
                title="Boleto bancário"
                allow="clipboard-write"
              />
            </div>
          </div>
        )}
      </CardContent>
    </>
  )
}
