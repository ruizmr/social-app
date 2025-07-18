import React, {useState} from 'react'
import {View} from 'react-native'
import {Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {useTheme, atoms as a} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import {TextField} from '#/components/form/TextField'
import {useMeshSession} from '#/state/meshSession'

export const MeshSignup = ({onSuccess}: {onSuccess: () => void}) => {
  const {_} = useLingui()
  const t = useTheme()
  const {signup} = useMeshSession()
  const [did, setDid] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const onPress = async () => {
    setProcessing(true)
    setError('')
    try {
      await signup(did)
      onSuccess()
    } catch (e: any) {
      setError(e?.message ?? 'error')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <View style={[a.p_lg]}> 
      <TextField.Root>
        <TextField.Input
          label={_(/*i18n*/ 'Bluesky DID')}
          value={did}
          onChangeText={setDid}
        />
      </TextField.Root>
      {error ? (
        <TextField.LabelText style={[t.atoms.text_error]}>{error}</TextField.LabelText>
      ) : null}
      <Button
        variant="solid"
        color="primary"
        size="large"
        onPress={onPress}
        disabled={processing || !did}>
        <ButtonText><Trans>Create account</Trans></ButtonText>
      </Button>
    </View>
  )
} 