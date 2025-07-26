import axios from 'axios'

const api = axios.create({
  baseURL:
    (process.env.MESHRUN_API || process.env.EXPO_PUBLIC_MESHRUN_API) ??
    'http://localhost:32543',
  timeout: 10000,
})

// ---------------- Authentication ----------------
export async function postSignup(payload: {handle: string; email: string; password: string}) {
  try {
    const res = await api.post('/signup', payload);
    return res.data as {did: string; jwt: string};
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}

export async function postLogin(identifier: string, password: string) {
  try {
    const res = await api.post('/login', {identifier, password});
    return res.data as {did: string; jwt: string};
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function setAuthToken(jwt: string | null) {
  if (jwt) {
    api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// ---------------- Networks ----------------
export interface NetworkInfo {
  id: string
  name: string
  ownerDid: string
}

export interface NetworksResponse {
  owned: NetworkInfo | null
  joined: NetworkInfo[]
  pending: NetworkInfo[]
}

export async function getNetworks(): Promise<NetworksResponse> {
  const res = await api.get('/networks')
  return res.data as NetworksResponse
}

export default api 