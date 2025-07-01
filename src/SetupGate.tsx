import React,{useState,useEffect} from 'react'
import WalletWizard from './screens/WalletWizard'
import NodeSetupWizard from './screens/NodeSetupWizard'
import { loadPriv } from './lib/wallet'
import { isNodeConfigured } from './lib/nodeConfig'

export default function SetupGate({children}:{children:React.ReactNode}){
  const [stage,setStage]=useState<'checking'|'wallet'|'node'|'done'>('checking')

  useEffect(()=>{
    (async()=>{
      const priv = await loadPriv()
      if(!priv){ setStage('wallet'); return }
      const node = await isNodeConfigured()
      setStage(node ? 'done' : 'node')
    })()
  },[])

  if(stage==='checking') return null
  if(stage==='wallet')  return <WalletWizard onDone={()=>setStage('node')} />
  if(stage==='node')    return <NodeSetupWizard onDone={()=>setStage('done')} />
  return <>{children}</>
} 