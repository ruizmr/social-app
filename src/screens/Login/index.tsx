import React, {useRef} from 'react'
import {KeyboardAvoidingView} from 'react-native'
import {LayoutAnimationConfig} from 'react-native-reanimated'
import {msg} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {DEFAULT_SERVICE} from '#/lib/constants'
import {logEvent} from '#/lib/statsig/statsig'
import {logger} from '#/logger'
import {useServiceQuery} from '#/state/queries/service'
import {type SessionAccount, useSession} from '#/state/session'
import {useLoggedOutView} from '#/state/shell/logged-out'
import {LoggedOutLayout} from '#/view/com/util/layouts/LoggedOutLayout'
import {ForgotPasswordForm} from '#/screens/Login/ForgotPasswordForm'
import {LoginForm} from '#/screens/Login/LoginForm'
import {PasswordUpdatedForm} from '#/screens/Login/PasswordUpdatedForm'
import {SetNewPasswordForm} from '#/screens/Login/SetNewPasswordForm'
import {atoms as a} from '#/alf'
import {ChooseAccountForm} from './ChooseAccountForm'
import {ScreenTransition} from './ScreenTransition'
import {MeshLogin} from './MeshLogin'

enum Forms {
  Login,
  ChooseAccount,
  ForgotPassword,
  SetNewPassword,
  PasswordUpdated,
}

export const Login = ({onPressBack}: {onPressBack: () => void}) => {
  return <MeshLogin onSuccess={onPressBack} />
}
