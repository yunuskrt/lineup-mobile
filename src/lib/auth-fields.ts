import type { AuthFieldConfig } from '@/types/auth-form';

const EMAIL: AuthFieldConfig = {
  name: 'email',
  label: 'Email',
  textContentType: 'emailAddress',
  autoComplete: 'email',
  keyboardType: 'email-address',
  isSecret: false,
};

export const SIGN_IN_FIELDS: readonly AuthFieldConfig[] = [
  EMAIL,
  {
    name: 'password',
    label: 'Password',
    textContentType: 'password',
    autoComplete: 'current-password',
    keyboardType: 'default',
    isSecret: true,
  },
];

// The web's order: the handle first, as it's the name in duels
export const SIGN_UP_FIELDS: readonly AuthFieldConfig[] = [
  {
    name: 'handle',
    label: 'Handle',
    hint: 'Your name in duels.',
    textContentType: 'username',
    autoComplete: 'username',
    keyboardType: 'default',
    isSecret: false,
  },
  EMAIL,
  {
    name: 'password',
    label: 'Password',
    textContentType: 'newPassword',
    autoComplete: 'new-password',
    keyboardType: 'default',
    isSecret: true,
  },
];
