import {useEffect, useReducer, useState} from 'react'
import {AppState, type AppStateStatus, View} from 'react-native'
import Animated, {FadeIn, LayoutAnimationConfig} from 'react-native-reanimated'
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
import {MeshSignup} from '#/screens/Signup/MeshSignup'
import {atoms as a, useBreakpoints, useTheme} from '#/alf'
import {AppLanguageDropdown} from '#/components/AppLanguageDropdown'
import {Divider} from '#/components/Divider'
import {LinearGradientBackground} from '#/components/LinearGradientBackground'
import {InlineLinkText} from '#/components/Link'
import {Text} from '#/components/Typography'
import * as bsky from '#/types/bsky'

export function Signup({onPressBack}: {onPressBack: () => void}) {
  return <MeshSignup onSuccess={onPressBack} />
}
