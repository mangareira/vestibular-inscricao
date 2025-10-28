import { useEffect, useState } from 'react'

export interface Payment {
  id: string
  name: string
  status: 'CONFIRMED' | 'OVERDUE' | 'PENDING' | 'RECEIVED'
  value: number
  pixCopiaECola?: string
  pixQrCodeId?: string
  bankSlipUrl?: string
  pixTransaction?: string
  identificationField?: string
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([])

  // 🔹 Carrega do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem('payments')
    if (stored) {
      try {
        setPayments(JSON.parse(stored))
      } catch {
        localStorage.removeItem('payments')
      }
    }
  }, [])

  // 🔹 Sincroniza com o servidor
  useEffect(() => {
    async function syncPayments() {
      try {
        const res = await fetch('/api/payments/get-payments', { credentials: 'include' })
        const data = await res.json()
        if (data?.payments) {
          setPayments(data.payments)
          localStorage.setItem('payments', JSON.stringify(data.payments))
        }
      } catch (err) {
        console.error('Erro ao sincronizar pagamentos:', err)
      }
    }

    // sincroniza ao iniciar
    syncPayments()

    // e a cada 5 minutos
    const interval = setInterval(syncPayments, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // 🔹 Atualiza o localStorage sempre que payments mudar
  useEffect(() => {
    if (payments && payments.length > 0) {
      localStorage.setItem('payments', JSON.stringify(payments))
    }
  }, [payments])

  return { payments, setPayments }
}
