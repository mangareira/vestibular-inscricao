// utilitário de requisições baseado no fetch nativo
export type ApiOptions = {
  timeoutMs?: number // tempo máximo (ms) antes do abort
  retries?: number // número de tentativas em caso de falha de rede
  retryDelayMs?: number // delay base para backoff exponencial
  headers?: Record<string, string>
}

export class ApiError extends Error {
  status?: number
  body?: unknown
  constructor(message: string, status?: number, body?: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

const defaultOptions: Required<Pick<ApiOptions, 'timeoutMs' | 'retries' | 'retryDelayMs'>> = {
  timeoutMs: 10_000,
  retries: 1,
  retryDelayMs: 300
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function request<T = unknown>(
  url: string,
  init: Omit<RequestInit, 'signal'> & { body?: unknown } = {},
  opts: ApiOptions = {}
): Promise<T> {
  const { timeoutMs, retries, retryDelayMs, headers } = { ...defaultOptions, ...opts }
  const token = "$" + process.env.ASAAS_TOKEN

  let attempt = 0
  while (true) {
    attempt++
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const mergedHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(headers ?? {})
      }

      if (token) {
        // adiciona automaticamente o header de token se disponível
        mergedHeaders['access_token'] = token
      }

      const response = await fetch(`${process.env.ASAAS_URL_SANDBOX}/${url}`, {
        ...init,
        headers: mergedHeaders,
        signal: controller.signal
      })

      clearTimeout(timeout)

      const text = await response.text()
      let parsed: unknown = undefined
      try {
        parsed = text ? JSON.parse(text) : undefined
      } catch {
        // se não for JSON, retorna o texto cru
        parsed = text
      }

      if (!response.ok) {
        throw new ApiError('Request failed', response.status, parsed)
      }

      return parsed as T
    } catch (error: unknown) {
      clearTimeout(timeout)

  const isNetwork = !(error instanceof ApiError) && (error instanceof Error)

      if (attempt > retries || !isNetwork) {
        // rethrow último erro com informação útil
        if (error instanceof ApiError) throw error
        throw new ApiError((error as Error)?.message ?? String(error))
      }

      // tentativa de retry
      const backoff = retryDelayMs * Math.pow(2, attempt - 1)
      await sleep(backoff)
      // e continua o loop para nova tentativa
    }
  }
}

export const get = <T = unknown>(url: string, opts?: ApiOptions) => request<T>(url, { method: 'GET' }, opts)
export const del = <T = unknown>(url: string, opts?: ApiOptions) => request<T>(url, { method: 'DELETE' }, opts)
export const post = <T = unknown>(url: string, body?: unknown, opts?: ApiOptions) =>
  request<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined }, opts)

const api = { request, get, post, 'delete': del, ApiError }
export default api