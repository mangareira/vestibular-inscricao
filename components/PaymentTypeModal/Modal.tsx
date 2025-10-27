'use client'

import { useState, useEffect } from 'react'
import { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import type { Course } from '@/utils/types/course'
import type { Course as TypeCourse } from '@/app/generated/prisma'
import Image from 'next/image'
import { Copy } from 'lucide-react'

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

  useEffect(() => setOpen(!!course), [course])

  if (!open || !course || !payment) {
    if (typeof window !== 'undefined') {
      document.body.style.overflowY = 'auto'
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
              <Button
                onClick={copyPix}
                className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <Copy className="h-4 w-4" />
                Copiar código Pix
              </Button>
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
