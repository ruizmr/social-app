import * as SecureStore from 'expo-secure-store'
import {encode as b64urlEncode} from 'base64-arraybuffer'
import {ec as EC} from 'elliptic'

const KEY_NAME = 'mesh_p256_priv'
const ec = new EC('p256')

export async function getOrCreateKey() {
  let pem = await SecureStore.getItemAsync(KEY_NAME)
  if (!pem) {
    const key = ec.genKeyPair()
    const privHex = key.getPrivate('hex')
    await SecureStore.setItemAsync(KEY_NAME, privHex)
    return key
  }
  return ec.keyFromPrivate(pem, 'hex')
}

export async function signNonce(nonce: string) {
  const key = await getOrCreateKey()
  const hash = new TextEncoder().encode(nonce)
  const sig = key.sign(hash)
  const r = sig.r.toArrayLike(Uint8Array, 'be', 32)
  const s = sig.s.toArrayLike(Uint8Array, 'be', 32)
  const raw = new Uint8Array([...r, ...s])
  return b64urlEncode(raw.buffer)
} 