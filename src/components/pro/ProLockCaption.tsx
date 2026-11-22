import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { PRO_PATH } from '@/lib/pro';

type Props = {
  caption: string;
};

// See Pro is a button: the design rules out text links
const ProLockCaption = ({ caption }: Props) => {
  return (
    <View className="items-start gap-3">
      <View className="flex-row items-start gap-2">
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <Badge label="Pro" tone="brand" icon={Lock} />
        </View>
        <Text className="flex-1 text-12 leading-5 text-fg-muted">
          {caption}
        </Text>
      </View>
      <Button
        label="See Pro"
        variant="secondary"
        onPress={() => router.push(PRO_PATH)}
      />
    </View>
  );
};

export default ProLockCaption;
