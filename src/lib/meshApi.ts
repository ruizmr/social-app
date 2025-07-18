import axios from 'axios'

const api = axios.create({
  baseURL: process.env.MESHRUN_API ?? 'http://localhost:8081',
  timeout: 10000,
})

export async function postSignup(did: string) {
  const res = await api.post('/signup', {did})
  return res.data as {did: string; cert_cid: string}
}

export async function getNonce(did: string) {
  const res = await api.get('/auth/bsky/nonce', {params: {did}})
  return res.data as {nonce: string}
}

export async function postAuth(did: string, nonce: string, sigB64: string) {
  const res = await api.post('/auth/bsky', {did, nonce, sigB64})
  return res.data as {token: string}
}

export function setAuthToken(jwt: string | null) {
  if (jwt) {
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export default api 