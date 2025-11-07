import { useEffect, useState } from 'react'
import { Course as TypeCourse } from '@/app/generated/prisma'
import { client } from '@/lib/hono'
import { PaymentRecord } from '../types/paymentRecord'
import { sampleCourses } from '../constants/sampleCourses'

export function useUserPayments(isLogin: boolean) {
  const [payments, setPayments] = useState<Record<string, TypeCourse | null>>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    async function fetchUserPayments() {
      try {
        const cookieParts = document.cookie.split(';').map((s) => s.trim())
        const idPair = cookieParts.find((s) => s.startsWith('id='))
        const cookieId = idPair?.split('=')[1]
        if (!cookieId) return

        const res = await client.api.payment['get-payments'].$get({
          cookie: { id: cookieId },
        })

        const data = await res.json()
        if (data && 'payments' in data && data.payments) {
          const backendPayments = data.payments
          const mapped: PaymentRecord = {}

          const tryMatchByName = (maybeName: unknown) => {
            if (!maybeName) return null
            const name = String(maybeName).toLowerCase().trim()
            return (
              sampleCourses.find((c) => {
                const title = c.title.toLowerCase()
                const combined = (c.title + ' ' + c.subtitle).toLowerCase()
                return (
                  title === name ||
                  combined === name ||
                  name.includes(title) ||
                  title.includes(name)
                )
              }) || null
            )
          }

          const extractName = (obj: unknown, key?: string) => {
            if (key) return key
            if (!obj || typeof obj !== 'object') return null
            const o = obj as Record<string, unknown>
            return (
              o.courseName ??
              o.name ??
              o.title ??
              (o.course &&
                ((o.course as Record<string, unknown>).name ??
                  (o.course as Record<string, unknown>).title)) ??
              null
            )
          }

          if (Array.isArray(backendPayments)) {
            for (const p of backendPayments as unknown[]) {
              const nameCandidate = extractName(p)
              const match = tryMatchByName(nameCandidate)
              if (match) mapped[match.id] = p
            }
          } else if (backendPayments && typeof backendPayments === 'object') {
            for (const [key, p] of Object.entries(backendPayments)) {
              const nameCandidate = extractName(p, key)
              const match = tryMatchByName(nameCandidate)
              if (match) mapped[match.id] = p
            }
          }

          setPayments((prev) => {
            const merged = { ...prev, ...mapped }
            try {
              localStorage.setItem('payments', JSON.stringify(merged))
            } catch {}
            return merged as Record<string, TypeCourse | null>
          })
        }
      } catch (err) {
        console.error('Erro ao buscar pagamentos do usuário', err)
      } 
    }

    fetchUserPayments()

    if (isLogin) {
      fetchUserPayments()
    }
  }, [isLogin])

  return { payments, setPayments }
}
