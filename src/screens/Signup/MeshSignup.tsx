import React, {useState} from 'react'
import {View} from 'react-native'
import {Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {useTheme, atoms as a, tokens} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as TextField from '#/components/forms/TextField'
import {useMeshSession} from '#/state/meshSession'
import {Text} from '#/components/Typography'
import {InlineLinkText} from '#/components/Link'
import {msg} from '@lingui/macro'
import { Loader } from '#/components/Loader'

export const MeshSignup = ({onSuccess}: {onSuccess: () => void}) => {
  const {_} = useLingui()
  const t = useTheme()
  const {signup} = useMeshSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const onPress = async () => {
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setProcessing(true)
    setError('')
    try {
      // Derive a simple handle from email: local part + .mesh
      const local = email.split('@')[0]
      const handle = `${local}.mesh` // ensure uniqueness logic TBD
      await signup(handle, email, password)
      onSuccess()
    } catch (e: any) {
      const errMsg = e?.message ?? 'error';
      if (errMsg.includes('Network')) {
        setError('Unable to connect to Omnimesh server. Ensure the backend is running (mesh-run start).');
      } else {
        setError(errMsg);
      }
    } finally {
      setProcessing(false)
    }
  }

  const isValidEmail = email.includes('@') && email.includes('.');

  const disabled = processing || !name || !isValidEmail || !password || password !== confirm;

  return (
    <View style={[a.flex_1, a.gap_2xl]}>
      <TextField.Root>
        <TextField.Input
          label={_(/*i18n*/ 'Full name')}
          value={name}
          onChangeText={setName}
        />
      </TextField.Root>
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
      <TextField.Root>
        <TextField.Input
          label={_(/*i18n*/ 'Confirm password')}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />
      </TextField.Root>
      <Text style={[a.text_sm, a.mt_sm]}>
        <Trans>By creating an account, you agree to our</Trans>
        <Button variant="ghost" color="secondary" size="small" label="Terms of Service" onPress={() => {}}>
          <ButtonText>{_(msg`Terms of Service`)}</ButtonText>
        </Button>
        <Trans>and</Trans>
        <Button variant="ghost" color="secondary" size="small" label="Privacy Policy" onPress={() => {}}>
          <ButtonText>{_(msg`Privacy Policy`)}</ButtonText>
        </Button>
      </Text>
      {error ? (
        <View style={[t.atoms.bg_contrast_25, a.p_md, a.rounded_sm]}>
          <Text style={[a.text_md, t.atoms.text_contrast_high]}>{error}</Text>
        </View>
      ) : null}
      <Button
        variant="solid"
        color="primary"
        size="large"
        label="Create account"
        onPress={onPress}
        disabled={disabled}>
        <ButtonText><Trans>Create account</Trans></ButtonText>
        {processing && <Loader />}
      </Button>
    </View>
  )
} 