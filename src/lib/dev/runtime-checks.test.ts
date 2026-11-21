import { describe, expect, it } from 'vitest';
import { RUNTIME_CHECKS, runCheck } from '@/lib/dev/runtime-checks';

describe('RUNTIME_CHECKS', () => {
  it.each(RUNTIME_CHECKS.map((check) => [check.label, check] as const))(
    '%s gives its expected value in Node',
    (_, check) => {
      expect(check.run()).toBe(check.expected);
    },
  );
});

describe('runCheck', () => {
  it('passes when the result matches', () => {
    expect(runCheck({ label: 'a', expected: 'x', run: () => 'x' })).toEqual({
      label: 'a',
      expected: 'x',
      actual: 'x',
      ok: true,
    });
  });

  it('fails when the result differs', () => {
    const result = runCheck({ label: 'a', expected: 'x', run: () => 'y' });
    expect(result).toMatchObject({ actual: 'y', ok: false });
  });

  it('fails with the message when the check throws', () => {
    const result = runCheck({
      label: 'a',
      expected: 'x',
      run: () => {
        throw new Error('URL is not implemented');
      },
    });
    expect(result).toMatchObject({
      actual: 'threw: URL is not implemented',
      ok: false,
    });
  });

  it('fails when the check throws a non-Error value', () => {
    const result = runCheck({
      label: 'a',
      expected: 'x',
      run: () => {
        throw 'bad';
      },
    });
    expect(result).toMatchObject({ actual: 'threw: bad', ok: false });
  });
});
