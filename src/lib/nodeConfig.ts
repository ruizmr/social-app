import * as SecureStore from 'expo-secure-store'

const KEY = 'mesh-node-configured'

export async function isNodeConfigured(): Promise<boolean> {
  return (await SecureStore.getItemAsync(KEY)) === '1'
}

export async function markNodeConfigured() {
  await SecureStore.setItemAsync(KEY, '1')
} 