import { getCloudflareContext } from '@opennextjs/cloudflare'

type WorkerStringBinding =
  | 'RESEND_API_KEY'
  | 'RESEND_FROM_EMAIL'
  | 'CONTACT_INQUIRY_TO_EMAIL'
  | 'VENUE_RENTAL_INQUIRY_TO_EMAIL'
  | 'BECOME_OUR_TENANT_INQUIRY_TO_EMAIL'

export async function readWorkerEnv(name: WorkerStringBinding): Promise<string> {
  const fromProcess = process.env[name]?.trim()
  if (fromProcess) return fromProcess

  try {
    const { env } = await getCloudflareContext({ async: true })
    const value = env[name as keyof typeof env]
    return typeof value === 'string' ? value.trim() : ''
  } catch {
    return ''
  }
}

export async function getResendConfig(): Promise<{ apiKey: string; from: string }> {
  const [apiKey, from] = await Promise.all([
    readWorkerEnv('RESEND_API_KEY'),
    readWorkerEnv('RESEND_FROM_EMAIL'),
  ])

  return { apiKey, from }
}
