import { describe, expect, it } from 'vitest';
import { SIGN_IN_FIELDS, SIGN_UP_FIELDS } from '@/lib/auth-fields';

describe('auth fields', () => {
  it('keeps the web order', () => {
    expect(SIGN_IN_FIELDS.map((field) => field.name)).toEqual([
      'email',
      'password',
    ]);
    expect(SIGN_UP_FIELDS.map((field) => field.name)).toEqual([
      'handle',
      'email',
      'password',
    ]);
  });

  it('asks password managers for a saved password on sign-in only', () => {
    const signIn = SIGN_IN_FIELDS.find((field) => field.name === 'password');
    const signUp = SIGN_UP_FIELDS.find((field) => field.name === 'password');
    expect(signIn?.autoComplete).toBe('current-password');
    expect(signIn?.textContentType).toBe('password');
    expect(signUp?.autoComplete).toBe('new-password');
    expect(signUp?.textContentType).toBe('newPassword');
  });

  it('hides passwords, and only passwords', () => {
    for (const field of [...SIGN_IN_FIELDS, ...SIGN_UP_FIELDS]) {
      expect(field.isSecret).toBe(field.name === 'password');
    }
  });

  it('gives the email field the email keyboard', () => {
    const email = SIGN_UP_FIELDS.find((field) => field.name === 'email');
    expect(email?.keyboardType).toBe('email-address');
  });
});
