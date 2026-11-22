import React from 'react';
import { router } from 'expo-router';
import AuthForm from '@/components/auth/AuthForm';
import { useSignUp } from '@/hooks/use-auth';
import { signUpRequestSchema } from '@/lib/api/schemas/auth';
import { SIGN_UP_FIELDS } from '@/lib/auth-fields';
import type { SignUpRequest } from '@/types/auth';

type Props = {};

// A guest's sign-up upgrades the same user, so their history stays
const SignUpForm = ({}: Props) => {
  const signUp = useSignUp();

  const submit = async (request: SignUpRequest) => {
    try {
      await signUp.mutateAsync(request);
      router.dismissTo('/play');
    } catch {
      // Shown through signUp.error
    }
  };

  return (
    <AuthForm
      schema={signUpRequestSchema}
      fields={SIGN_UP_FIELDS}
      submitLabel="Create account"
      pendingLabel="Creating account…"
      isPending={signUp.isPending}
      error={signUp.error}
      onSubmit={submit}
    />
  );
};

export default SignUpForm;
