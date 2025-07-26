import React, {useState} from 'react'
import {View, Text} from 'react-native'
import {Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import { useTheme, atoms as a, tokens } from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as TextField from '#/components/forms/TextField'
import {useMeshSession} from '#/state/meshSession'
import {InlineLinkText} from '#/components/Link'
import {msg} from '@lingui/macro'
import {Loader} from '#/components/Loader'

export const MeshLogin = ({onSuccess}: {onSuccess: () => void}) => {
  const {_} = useLingui()
  const t = useTheme()
  const {login} = useMeshSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const onPress = async () => {
    setProcessing(true)
    setError('')
    try {
      await login(email, password)
      onSuccess()
    } catch (e: any) {
      setError(e?.message ?? 'error')
    } finally {
      setProcessing(false)
    }
  }

  const disabled = processing || !email || !password

  return (
    <View style={[a.flex_1, a.gap_2xl]}>
      <TextField.Root>
        <TextField.Input
          label={_(/*i18n*/ 'Email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </TextField.Root>
      <TextField.Root>
        <TextField.Input
          label={_(/*i18n*/ 'Password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </TextField.Root>
      {error ? (
        <View style={[a.bg_contrast_100, a.p_md, a.rounded_sm]}>
          <Text style={[a.text_md, t.atoms.text_contrast_high]}>{error}</Text>
        </View>
      ) : null}
      <Button
        variant="solid"
        color="primary"
        size="large"
        label="Sign in"
        onPress={onPress}
        disabled={disabled}>
        <ButtonText><Trans>Sign in</Trans></ButtonText>
        {processing && <Loader />}
      </Button>
      <View style={[a.flex_row, a.justify_between]}>
        <Button variant="ghost" color="secondary" size="small" label={_(msg`Forgot password?`)} onPress={() => {}}>
          <ButtonText>{_(msg`Forgot password?`)}</ButtonText>
        </Button>
        <Button variant="ghost" color="secondary" size="small" label={_(msg`Create account`)} onPress={() => {}}>
          <ButtonText>{_(msg`Create account`)}</ButtonText>
        </Button>
      </View>
    </View>
  )
} 