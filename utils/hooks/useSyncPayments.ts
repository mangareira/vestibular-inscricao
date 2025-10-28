import { client } from '@/lib/hono'
import { useEffect } from 'react'

export function useSyncPayments() {
  useEffect(() => {
    async function sync() {
      try {
        const res = await client.api.payment['get-payments'].$get({
          cookie: {
            id: document.cookie.split(';')[0].split('=')[1],
          } 
        })
        const data = await res.json()

        if ('payments' in data) {
          localStorage.setItem('user_payments', JSON.stringify(data.payments))
        }
      } catch (err) {
        console.error('Erro ao sincronizar pagamentos', err)
      }
    }

    sync()

    const interval = setInterval(sync, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])
}
