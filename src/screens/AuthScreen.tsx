import { useState } from 'react';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError, api, endpoints, saveAuthSession, type AuthSession } from '@/api';
import { CustomButton, CustomText } from '@/components';
import { useTheme } from '@/theme';

type AuthRequest = {
  name?: string;
  emailId?: string;
  phoneNo?: string;
  password: string;
};

type Mode = 'login' | 'signup';

type FieldErrors = {
  name?: string;
  identifier?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{10,15}$/;

function normalizePhone(value: string): string {
  return value.replace(/[\s()-]/g, '');
}

function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

function isPhone(value: string): boolean {
  return PHONE_PATTERN.test(normalizePhone(value.trim()));
}

export function AuthScreen() {
  const { colors } = useTheme();
  const [mode, setMode] = useState<Mode>('login');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
    setFormError(null);
  }

  function validate(): boolean {
    const next: FieldErrors = {};
    const trimmedPassword = password.trim();

    if (mode === 'login') {
      const trimmedIdentifier = identifier.trim();
      if (!trimmedIdentifier) {
        next.identifier = 'Enter an email or phone number';
      } else if (!isEmail(trimmedIdentifier) && !isPhone(trimmedIdentifier)) {
        next.identifier = 'Enter a valid email or phone number';
      }
    } else {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();
      const trimmedPhone = phone.trim();

      if (!trimmedName) {
        next.name = 'Enter your name';
      }

      if (!trimmedEmail && !trimmedPhone) {
        next.email = 'Enter an email or a phone number';
        next.phone = 'Enter an email or a phone number';
      } else {
        if (trimmedEmail && !isEmail(trimmedEmail)) {
          next.email = 'Enter a valid email';
        }
        if (trimmedPhone && !isPhone(trimmedPhone)) {
          next.phone = 'Enter a valid phone number';
        }
      }

      if (!confirmPassword) {
        next.confirmPassword = 'Confirm your password';
      } else if (confirmPassword !== password) {
        next.confirmPassword = 'Passwords do not match';
      }
    }

    if (!trimmedPassword) {
      next.password = 'Enter a password';
    } else if (trimmedPassword.length < MIN_PASSWORD_LENGTH) {
      next.password = 'Password must be at least 8 characters';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function authBody(): AuthRequest {
    const trimmedPassword = password.trim();

    if (mode === 'login') {
      const trimmedIdentifier = identifier.trim();
      if (isEmail(trimmedIdentifier)) {
        return { emailId: trimmedIdentifier, password: trimmedPassword };
      }
      return { phoneNo: normalizePhone(trimmedIdentifier), password: trimmedPassword };
    }

    const body: AuthRequest = { name: name.trim(), password: trimmedPassword };
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    if (trimmedEmail) {
      body.emailId = trimmedEmail;
    }
    if (trimmedPhone) {
      body.phoneNo = normalizePhone(trimmedPhone);
    }
    return body;
  }

  async function submit() {
    if (submitting || !validate()) {
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const path = mode === 'login' ? endpoints.login : endpoints.signUp;
      const data = await api.post<AuthSession>(path, authBody(), {
        headers: { Accept: '*/*' },
      });
      saveAuthSession(data);
      api.setAccessToken(data.token);
      router.replace('/home');
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setFormError(err.message);
        return;
      }
      setFormError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setSubmitting(false);
    }
  }

  const isLogin = mode === 'login';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <CustomText id="auth-title" variant="large">
            {isLogin ? 'Login' : 'Sign up'}
          </CustomText>
          <CustomText id="auth-subtitle" variant="body" style={[styles.subtitle, { color: colors.textMuted }]}>
            {isLogin
              ? 'Use your email or phone number'
              : 'Name, email or phone, and a password'}
          </CustomText>

          {isLogin ? (
            <Field
              id="auth-identifier"
              label="Email ID / Phone no"
              value={identifier}
              onChangeText={setIdentifier}
              error={errors.identifier}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
              autoComplete="username"
            />
          ) : (
            <>
              <Field
                id="auth-name"
                label="Name"
                value={name}
                onChangeText={setName}
                error={errors.name}
                autoCapitalize="words"
                autoCorrect={false}
                textContentType="name"
                autoComplete="name"
              />
              <Field
                id="auth-email"
                label="Email ID"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
              />
              <Field
                id="auth-phone"
                label="Phone no"
                value={phone}
                onChangeText={setPhone}
                error={errors.phone}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                autoComplete="tel"
              />
            </>
          )}

          <Field
            id="auth-password"
            label={isLogin ? 'Password' : 'Create password'}
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            textContentType={isLogin ? 'password' : 'newPassword'}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />

          {isLogin ? null : (
            <Field
              id="auth-confirm-password"
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
            />
          )}

          {formError ? (
            <CustomText id="auth-form-error" variant="error">
              {formError}
            </CustomText>
          ) : null}

          <CustomButton
            id={isLogin ? 'auth-login' : 'auth-signup'}
            label={isLogin ? 'Login' : 'Signup'}
            onPress={submit}
            loading={submitting}
            style={styles.button}
          />

          {isLogin ? (
            <CustomText id="auth-switch-to-signup" variant="small" style={styles.switchText}>
              Not registered,{' '}
              <CustomText
                id="auth-switch-to-signup-link"
                variant="link"
                style={styles.switchLink}
                onPress={() => switchMode('signup')}
                accessibilityRole="link"
              >
                signup here
              </CustomText>
            </CustomText>
          ) : (
            <CustomText id="auth-switch-to-login" variant="small" style={styles.switchText}>
              Already registered,{' '}
              <CustomText
                id="auth-switch-to-login-link"
                variant="link"
                style={styles.switchLink}
                onPress={() => switchMode('login')}
                accessibilityRole="link"
              >
                login here
              </CustomText>
            </CustomText>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  id,
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  autoCapitalize,
  autoCorrect,
  keyboardType,
  textContentType,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  textContentType?: 'name' | 'username' | 'emailAddress' | 'telephoneNumber' | 'password' | 'newPassword';
  autoComplete?: 'name' | 'username' | 'email' | 'tel' | 'current-password' | 'new-password';
}) {
  const { colors } = useTheme();

  return (
    <View style={styles.field}>
      <CustomText id={`${id}-label`} variant="label">
        {label}
      </CustomText>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        textContentType={textContentType}
        autoComplete={autoComplete}
        placeholder={label}
        placeholderTextColor={colors.textDim}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.danger : colors.border,
            color: colors.text,
          },
        ]}
      />
      {error ? (
        <CustomText id={`${id}-error`} variant="error" style={styles.fieldError}>
          {error}
        </CustomText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
  },
  subtitle: {
    marginTop: -8,
    marginBottom: 8,
  },
  field: {
    gap: 6,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  fieldError: {
    fontSize: 13,
  },
  button: {
    marginTop: 8,
  },
  switchText: {
    textAlign: 'center',
    fontSize: 15,
  },
  switchLink: {
    fontSize: 15,
  },
});
