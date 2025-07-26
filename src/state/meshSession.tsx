import React, {createContext, useContext, useState, useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {postSignup, postLogin, setAuthToken} from '#/lib/meshApi'
import {signNonce} from '#/lib/didSigning'

interface SessionCtx {
  did: string | null
  jwt: string | null
  signup: (handle: string, email: string, password: string) => Promise<void>
  login: (identifier: string, password: string) => Promise<void>
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

  const signup = async (handle: string, email: string, password: string) => {
    const {did: newDid, jwt: newJwt} = await postSignup({handle, email, password})
    await AsyncStorage.setItem('mesh_jwt', newJwt)
    await AsyncStorage.setItem('mesh_did', newDid)
    setAuthToken(newJwt)
    setDid(newDid)
    setJwt(newJwt)
  }

  const login = async (identifier: string, password: string) => {
    const {did: loginDid, jwt: token} = await postLogin(identifier, password)
    await AsyncStorage.setItem('mesh_jwt', token)
    await AsyncStorage.setItem('mesh_did', loginDid)
    setAuthToken(token)
    setDid(loginDid)
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