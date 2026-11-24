import React from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const NOTE = 'Pro isn’t on sale yet.';

type Props = {};

// The one place checkout plugs in, with payments
const GetProButton = ({}: Props) => {
  return (
    <View className="gap-2">
      <Button
        label="Get Pro"
        size="large"
        isDisabled
        accessibilityHint={NOTE}
      />
      {/* Read as the button's hint, so not twice */}
      <Text
        accessibilityElementsHidden
        importantForAccessibility="no"
        className="text-14 leading-5 text-fg-muted"
      >
        {NOTE}
      </Text>
    </View>
  );
};

export default GetProButton;
