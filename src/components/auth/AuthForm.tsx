import React, { useRef, useState } from 'react';
import { type TextInputInstance, View } from 'react-native';
import type { z } from 'zod';
import { TriangleAlert } from 'lucide-react-native';
import AuthField from '@/components/auth/auth-form/AuthField';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { authErrorMessageOf, authFieldErrors } from '@/lib/auth';
import type {
  AuthField as AuthFieldName,
  AuthFieldErrors,
  AuthFieldValues,
} from '@/types/auth';
import type { AuthFieldConfig } from '@/types/auth-form';

type Props<S extends z.ZodType> = {
  schema: S;
  fields: readonly AuthFieldConfig[];
  submitLabel: string;
  pendingLabel: string;
  isPending: boolean;
  error: unknown;
  onSubmit: (request: z.output<S>) => void;
};

// Checked here for speed; the backend checks again and has the last word
const AuthForm = <S extends z.ZodType>(props: Props<S>) => {
  const { schema, fields, submitLabel, pendingLabel, isPending, error } = props;
  const [values, setValues] = useState<AuthFieldValues>({});
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const inputs = useRef<
    Partial<Record<AuthFieldName, TextInputInstance | null>>
  >({});

  const change = (name: AuthFieldName, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = () => {
    if (isPending) return;
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors = authFieldErrors(schema, values);
      setErrors(fieldErrors);
      const firstInvalid = fields.find((field) => fieldErrors[field.name]);
      if (firstInvalid) inputs.current[firstInvalid.name]?.focus();
      return;
    }
    props.onSubmit(parsed.data);
  };

  return (
    <View className="gap-5">
      {fields.map((field, index) => {
        const next = fields[index + 1];
        return (
          <AuthField
            key={field.name}
            field={field}
            value={values[field.name] ?? ''}
            error={errors[field.name]}
            isReadOnly={isPending}
            isLast={!next}
            inputRef={(node) => {
              inputs.current[field.name] = node;
            }}
            onChange={(value) => change(field.name, value)}
            onSubmitEditing={() =>
              next ? inputs.current[next.name]?.focus() : submit()
            }
          />
        );
      })}
      {error && !isPending ? (
        <Alert tone="warning" icon={TriangleAlert}>
          {authErrorMessageOf(error)}
        </Alert>
      ) : null}
      <Button
        label={isPending ? pendingLabel : submitLabel}
        size="large"
        isBusy={isPending}
        onPress={submit}
      />
    </View>
  );
};

export default AuthForm;
