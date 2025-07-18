import React, {createContext, useContext, useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {postSignup, getNonce, postAuth, setAuthToken} from '#/lib/meshApi'
import {signNonce} from '#/lib/didSigning'

interface SessionCtx {
  did: string | null
  jwt: string | null
  signup: (did: string) => Promise<void>
  login: (did: string) => Promise<void>
  logout: () => void
}

const Ctx = createContext<SessionCtx>(null as any)

export const MeshSessionProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [did, setDid] = useState<string|null>(null)
  const [jwt, setJwt] = useState<string|null>(null)

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('mesh_jwt')
      const savedDid = await AsyncStorage.getItem('mesh_did')
      if (saved && savedDid) {
        setJwt(saved)
        setDid(savedDid)
        setAuthToken(saved)
      }
    })()
  }, [])

  const signup = async (did: string) => {
    await postSignup(did)
  }

  const login = async (didIn: string) => {
    const {nonce} = await getNonce(didIn)
    const sig = await signNonce(nonce)
    const {token} = await postAuth(didIn, nonce, sig)
    await AsyncStorage.setItem('mesh_jwt', token)
    await AsyncStorage.setItem('mesh_did', didIn)
    setAuthToken(token)
    setDid(didIn)
    setJwt(token)
  }

  const logout = async () => {
    await AsyncStorage.multiRemove(['mesh_jwt','mesh_did'])
    setAuthToken(null)
    setDid(null)
    setJwt(null)
  }

  return <Ctx.Provider value={{did,jwt,signup,login,logout}}>{children}</Ctx.Provider>
}

export const useMeshSession = () => useContext(Ctx) 