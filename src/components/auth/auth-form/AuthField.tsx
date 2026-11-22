import React, { type Ref } from 'react';
import { type TextInputInstance, View } from 'react-native';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import type { AuthFieldConfig } from '@/types/auth-form';

type Props = {
  field: AuthFieldConfig;
  value: string;
  error?: string;
  isReadOnly: boolean;
  isLast: boolean;
  inputRef: Ref<TextInputInstance>;
  onChange: (value: string) => void;
  onSubmitEditing: () => void;
};

const AuthField = ({
  field,
  value,
  error,
  isReadOnly,
  isLast,
  inputRef,
  onChange,
  onSubmitEditing,
}: Props) => {
  return (
    <View className="gap-1.5">
      <Text className="font-body-medium text-14">{field.label}</Text>
      <Input
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        editable={!isReadOnly}
        isInvalid={Boolean(error)}
        accessibilityLabel={field.label}
        accessibilityHint={error ?? field.hint}
        textContentType={field.textContentType}
        autoComplete={field.autoComplete}
        keyboardType={field.keyboardType}
        secureTextEntry={field.isSecret}
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        returnKeyType={isLast ? 'go' : 'next'}
        submitBehavior={isLast ? 'blurAndSubmit' : 'submit'}
        onSubmitEditing={onSubmitEditing}
      />
      {error ? (
        <Text accessibilityRole="alert" className="text-12 text-danger-text">
          {error}
        </Text>
      ) : field.hint ? (
        <Text className="text-12 text-fg-muted">{field.hint}</Text>
      ) : null}
    </View>
  );
};

export default AuthField;
