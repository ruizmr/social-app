import React, {createContext, useContext, useEffect, useState} from 'react'
import {getNetworks, NetworkInfo} from '#/lib/meshApi'
import {useMeshSession} from '#/state/meshSession'

interface NetworksCtx {
  owned: NetworkInfo | null
  joined: NetworkInfo[]
  pending: NetworkInfo[]
  refresh: () => Promise<void>
  isNetworkDid: (did: string) => boolean
  isMember: (did: string) => boolean
}

const Ctx = createContext<NetworksCtx>(null as any)

export const NetworksProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {jwt} = useMeshSession()
  const [owned, setOwned] = useState<NetworkInfo | null>(null)
  const [joined, setJoined] = useState<NetworkInfo[]>([])
  const [pending, setPending] = useState<NetworkInfo[]>([])

  const fetch = async () => {
    if (!jwt) return
    try {
      const res = await getNetworks()
      setOwned(res.owned)
      setJoined(res.joined)
      setPending(res.pending)
    } catch (e) {
      // swallow – can be unauth during startup
    }
  }

  useEffect(() => { fetch() }, [jwt])

  const isNetworkDid = (did: string) => {
    if (owned && owned.ownerDid === did) return true
    return joined.some(n => n.ownerDid === did)
  }

  const isMember = (ownerDid: string) => {
    if (owned && owned.ownerDid === ownerDid) return true
    return joined.some(n => n.ownerDid === ownerDid)
  }

  return (
    <Ctx.Provider value={{owned, joined, pending, refresh: fetch, isNetworkDid, isMember}}>
      {children}
    </Ctx.Provider>
  )
}

export const useNetworks = () => useContext(Ctx) 