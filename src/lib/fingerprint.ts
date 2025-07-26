import FingerprintJS from '@fingerprintjs/fingerprintjs'

let cachedId: string | undefined

/**
 * Returns a stable browser/device fingerprint. Caches the result after first call.
 */
export async function getFingerprint(): Promise<string> {
  if (cachedId) return cachedId
  const fp = await FingerprintJS.load()
  const res = await fp.get()
  cachedId = res.visitorId
  return cachedId
} 