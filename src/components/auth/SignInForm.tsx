import React from 'react';
import { router } from 'expo-router';
import AuthForm from '@/components/auth/AuthForm';
import { useSignIn } from '@/hooks/use-auth';
import { signInRequestSchema } from '@/lib/api/schemas/auth';
import { SIGN_IN_FIELDS } from '@/lib/auth-fields';
import type { SignInRequest } from '@/types/auth';

type Props = {};

const SignInForm = ({}: Props) => {
  const signIn = useSignIn();

  const submit = async (request: SignInRequest) => {
    try {
      await signIn.mutateAsync(request);
      router.dismissTo('/play');
    } catch {
      // Shown through signIn.error
    }
  };

  return (
    <AuthForm
      schema={signInRequestSchema}
      fields={SIGN_IN_FIELDS}
      submitLabel="Sign in"
      pendingLabel="Signing in…"
      isPending={signIn.isPending}
      error={signIn.error}
      onSubmit={submit}
    />
  );
};

export default SignInForm;
