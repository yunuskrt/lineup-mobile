import React, { useState } from 'react';
import { TextInput, type TextInputProps, View } from 'react-native';
import { TEXT_INPUT } from '@/components/ui/styles';
import { cn } from '@/lib/utils';
import { SHADOW_HARD_SM } from '@/styles/shadow';
import { ROLES } from '@/styles/tokens';

type Props = TextInputProps & {
  className?: string;
  isInvalid?: boolean;
};

export const Input = ({
  className,
  isInvalid = false,
  editable = true,
  onFocus,
  onBlur,
  ...props
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View
      className="rounded-md"
      // boxShadow: the focused field gains the small hard shadow
      style={isFocused ? SHADOW_HARD_SM : undefined}
    >
      <TextInput
        editable={editable}
        placeholderTextColor={ROLES['fg-dim']}
        aria-invalid={isInvalid}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        className={cn(
          TEXT_INPUT,
          isInvalid && 'border-danger',
          !editable && 'text-fg-muted',
          className,
        )}
        {...props}
      />
    </View>
  );
};
