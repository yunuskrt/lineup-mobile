import type { AuthField } from '@/types/auth';

export type AuthFieldConfig = {
  name: AuthField;
  label: string;
  hint?: string;
  // iOS password managers read this; Android reads autoComplete
  textContentType: 'emailAddress' | 'password' | 'newPassword' | 'username';
  autoComplete: 'email' | 'current-password' | 'new-password' | 'username';
  keyboardType: 'default' | 'email-address';
  isSecret: boolean;
};
