import React, {useEffect, useState} from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { createWallet } from '../lib/wallet'

export default function WalletWizard({ onDone }: { onDone: () => void }) {
  const [did, setDid] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const newDid = await createWallet()
        setDid(newDid)
        setTimeout(onDone, 800)
      } catch (e:any) {
        setError(e?.message ?? 'failed')
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setting up your OmniMesh identity…</Text>
      {did ? (
        <Text style={styles.did}>✅ DID created: {did}</Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center', padding:24 },
  title: { fontSize:24, fontWeight:'bold', marginBottom:12 },
  subtitle: { textAlign:'center', marginBottom:20 },
  did: { color:'green', marginTop:20, textAlign:'center' },
  error: { color:'red', marginTop:20 },
}) 