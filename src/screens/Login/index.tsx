import React, {useRef, useState} from 'react'
import {KeyboardAvoidingView} from 'react-native'
import {LayoutAnimationConfig} from 'react-native-reanimated'
import {msg} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {DEFAULT_SERVICE} from '#/lib/constants'
import {logEvent} from '#/lib/statsig/statsig'
import {logger} from '#/logger'
import {useServiceQuery} from '#/state/queries/service'
import {type SessionAccount, useSession} from '#/state/session'
import {useLoggedOutViewControls} from '#/state/shell/logged-out'
import {LoggedOutLayout} from '#/view/com/util/layouts/LoggedOutLayout'
import {ForgotPasswordForm} from '#/screens/Login/ForgotPasswordForm'
import {LoginForm} from '#/screens/Login/LoginForm'
import {PasswordUpdatedForm} from '#/screens/Login/PasswordUpdatedForm'
import {SetNewPasswordForm} from '#/screens/Login/SetNewPasswordForm'
import {atoms as a} from '#/alf'
import {ChooseAccountForm} from './ChooseAccountForm'
import {ScreenTransition} from './ScreenTransition'
import {MeshLogin} from './MeshLogin'
import {useSessionApi} from '#/state/session';

enum Forms {
  Login,
  ChooseAccount,
  ForgotPassword,
  SetNewPassword,
  PasswordUpdated,
}

export const Login = ({onPressBack}: {onPressBack: () => void}) => {
  const [currentForm, setCurrentForm] = useState(Forms.ChooseAccount);
  const [error, setError] = useState('');
  const {data: localServiceDesc} = useServiceQuery('http://localhost:2583');
  const {resumeSession} = useSessionApi();
  const {setShowLoggedOut} = useLoggedOutViewControls();

  const onSelectAccount = async (account?: SessionAccount) => {
    if (!account) {
      setCurrentForm(Forms.Login);
      return;
    }
    try {
      await resumeSession(account);
      setShowLoggedOut(false);
    } catch (e) {
      setCurrentForm(Forms.Login);
    }
  };

  const onPressRetryConnect = () => {};
  const onAttemptSuccess = () => {};
  const onAttemptFailed = () => {};

  const initialHandle = '';

  return (
    <LoggedOutLayout leadin="Welcome" title="Sign in" description="Enter your username and password">
      <KeyboardAvoidingView behavior="padding" style={[a.flex_1]}>
        <ScreenTransition>
          {currentForm === Forms.ChooseAccount && (
            <ChooseAccountForm
              onSelectAccount={onSelectAccount}
              onPressBack={onPressBack}
            />
          )}
          {currentForm === Forms.Login && (
            <MeshLogin onSuccess={() => { /* handle success */ }} />
          )}
          {currentForm === Forms.ForgotPassword && (
            <ForgotPasswordForm
              error={error}
              serviceUrl={serviceUrl}
              serviceDescription={localServiceDesc}
              setError={setError}
              setServiceUrl={setServiceUrl}
              onPressBack={() => setCurrentForm(Forms.Login)}
              onEmailSent={() => setCurrentForm(Forms.SetNewPassword)}
            />
          )}
          {currentForm === Forms.SetNewPassword && (
            <SetNewPasswordForm
              error={error}
              serviceUrl={serviceUrl}
              setError={setError}
              onPressBack={() => setCurrentForm(Forms.Login)}
              onPasswordSet={() => setCurrentForm(Forms.PasswordUpdated)}
            />
          )}
          {currentForm === Forms.PasswordUpdated && (
            <PasswordUpdatedForm onPressNext={onPressBack} />
          )}
        </ScreenTransition>
      </KeyboardAvoidingView>
    </LoggedOutLayout>
  );
};
