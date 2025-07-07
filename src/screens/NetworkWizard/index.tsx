import React, {useState} from 'react'
import {View, TextInput} from 'react-native'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {useNavigation} from '@react-navigation/native'

import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import {Loader} from '#/components/Loader'
import {Text} from '#/components/Typography'
import {useOnboardingDispatch} from '#/state/shell'
import {NavigationProp} from '#/lib/routes/types'

export default function NetworkWizard() {
  const {_} = useLingui()
  const t = useTheme()
  const navigation = useNavigation<NavigationProp>()
  const onboardingDispatch = useOnboardingDispatch()

  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [addr, setAddr] = useState('')
  const [key, setKey] = useState('') // URL or path
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setErr('')
    if (!name) {
      setErr(_('Network name required'))
      return
    }
    if (mode === 'join' && (!addr || !key)) {
      setErr(_('Address and key required'))
      return
    }
    setLoading(true)
    try {
      const endpoint = mode === 'create' ? '/net/create' : '/net/join'
      const body = mode === 'create' ? {name, addr} : {name, addr, key}
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || res.statusText)
      }
      // Success – kick off onboarding
      onboardingDispatch({type: 'start'})
      navigation.navigate('HomeTab')
    } catch (e: any) {
      setErr(e.toString())
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[a.flex_1, a.p_lg, t.atoms.bg, a.gap_lg]}>
      <Text style={[a.text_2xl, a.font_bold]}>
        <Trans>Mesh Network Setup</Trans>
      </Text>

      <View style={[a.flex_row, a.gap_md]}>
        <Button
          variant={mode === 'create' ? 'solid' : 'outline'}
          size="small"
          label={_(msg`Create`)}
          onPress={() => setMode('create')}>
          <ButtonText>
            <Trans>Create</Trans>
          </ButtonText>
        </Button>
        <Button
          variant={mode === 'join' ? 'solid' : 'outline'}
          size="small"
          label={_(msg`Join`)}
          onPress={() => setMode('join')}>
          <ButtonText>
            <Trans>Join</Trans>
          </ButtonText>
        </Button>
      </View>

      <View style={[a.gap_sm]}>
        <Text>
          <Trans>Network Name</Trans>
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder={_(msg`e.g. my-mesh`)}
          style={[a.border, t.atoms.border_contrast_medium, a.rounded_sm, a.p_sm]}
        />
      </View>

      {mode === 'create' ? (
        <View style={[a.gap_sm]}>
          <Text>
            <Trans>Bootstrap Address (optional)</Trans>
          </Text>
          <TextInput
            value={addr}
            onChangeText={setAddr}
            placeholder={_(msg`multiaddr`)}
            style={[a.border, t.atoms.border_contrast_medium, a.rounded_sm, a.p_sm]}
          />
        </View>
      ) : (
        <>
          <View style={[a.gap_sm]}>
            <Text>
              <Trans>Bootstrap Address</Trans>
            </Text>
            <TextInput
              value={addr}
              onChangeText={setAddr}
              placeholder={_(msg`multiaddr`)}
              style={[a.border, t.atoms.border_contrast_medium, a.rounded_sm, a.p_sm]}
            />
          </View>
          <View style={[a.gap_sm]}>
            <Text>
              <Trans>Swarm Key URL or Path</Trans>
            </Text>
            <TextInput
              value={key}
              onChangeText={setKey}
              placeholder={_(msg`https://example.com/swarm.key`)}
              style={[a.border, t.atoms.border_contrast_medium, a.rounded_sm, a.p_sm]}
            />
          </View>
        </>
      )}

      {err ? (
        <Text style={[t.atoms.text_negative]}>{err}</Text>
      ) : null}

      <Button
        variant="solid"
        color="primary"
        size="large"
        label={mode === 'create' ? _(msg`Create Network`) : _(msg`Join Network`)}
        onPress={submit}
        disabled={loading}>
        <ButtonText>
          {mode === 'create' ? <Trans>Create Network</Trans> : <Trans>Join Network</Trans>}
        </ButtonText>
        {loading && <Loader size="sm" />}
      </Button>
    </View>
  )
} 