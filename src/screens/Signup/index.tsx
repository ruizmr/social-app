import {useEffect, useReducer, useState} from 'react'
import {AppState, type AppStateStatus, View} from 'react-native'
import Animated, {FadeIn} from 'react-native-reanimated';
import {LayoutAnimation} from 'react-native';
import {AppBskyGraphStarterpack} from '@atproto/api'
import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {FEEDBACK_FORM_URL} from '#/lib/constants'
import {useServiceQuery} from '#/state/queries/service'
import {useStarterPackQuery} from '#/state/queries/starter-packs'
import {useActiveStarterPack} from '#/state/shell/starter-pack'
import {LoggedOutLayout} from '#/view/com/util/layouts/LoggedOutLayout'
import {
  initialState,
  reducer,
  SignupContext,
  SignupStep,
  useSubmitSignup,
} from '#/screens/Signup/state'
import {StepInfo} from './StepInfo';

import {StepCaptcha} from './StepCaptcha';

import {StepHandle} from './StepHandle';

import {Layout} from 'react-native-reanimated';

import {atoms as a, useBreakpoints, useTheme} from '#/alf'
import {AppLanguageDropdown} from '#/components/AppLanguageDropdown'
import {Divider} from '#/components/Divider'
import {LinearGradientBackground} from '#/components/LinearGradientBackground'
import {InlineLinkText} from '#/components/Link'
import {Text} from '#/components/Typography'
import * as bsky from '#/types/bsky'
import {MeshSignup} from './MeshSignup'

export function Signup({onPressBack}: {onPressBack: () => void}) {

  const [state, dispatch] = useReducer(reducer, initialState);

  const submit = useSubmitSignup();

  return (
    <LoggedOutLayout leadin="Welcome to Omnimesh" title="Create Account" description="Join the decentralized mesh network">
      <View style={[a.flex_1, a.justify_center, a.p_lg]}>
        <MeshSignup onSuccess={() => { /* navigate to home or next */ }} />
      </View>
    </LoggedOutLayout>
  );

}
