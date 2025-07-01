import * as Device from 'expo-device'
import * as SecureStore from 'expo-secure-store'
import { sha256 } from 'js-sha256'

const KEY = 'mesh-device-fp'

export async function getFingerprint(): Promise<string> {
  let fp = await SecureStore.getItemAsync(KEY)
  if (fp) return fp
  // Build a stable string using hardware + OS + app identifiers.
  const parts = [
    Device.osName,
    Device.osVersion,
    Device.brand,
    Device.modelId,
    Device.totalMemory?.toString() ?? '',
  ].join('|')
  fp = sha256(parts)
  await SecureStore.setItemAsync(KEY, fp)
  return fp
} 