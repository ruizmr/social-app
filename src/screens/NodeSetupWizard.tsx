import React, {useState} from 'react'
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native'
import { markNodeConfigured } from '../lib/nodeConfig'
import { elastic_up } from '../../agent' // placeholder comment

export default function NodeSetupWizard({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState<string|null>(null)

  const setupCloud = async () => {
    setLoading(true)
    try {
      // TODO: call backend /elastic_up with default template
      await new Promise(res=>setTimeout(res,1500))
      await markNodeConfigured()
      onDone()
    } catch(e:any){
      setError(e?.message??'failed')
    } finally { setLoading(false) }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set up your first OmniMesh node</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          <Button title="Provision Cloud Node (RunPod)" onPress={setupCloud} />
          <View style={{height:12}} />
          <Button title="I will run a local node later" onPress={onDone} />
        </>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{flex:1,alignItems:'center',justifyContent:'center',padding:24},
  title:{fontSize:20,fontWeight:'bold',marginBottom:20},
  error:{color:'red',marginTop:16},
}) 