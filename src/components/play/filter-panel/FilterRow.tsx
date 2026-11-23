import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import { FILTER_LABEL, FILTER_ROW } from '@/components/play/styles';
import { Text } from '@/components/ui/text';

type Props = {
  label: string;
  children: ReactNode;
};

const FilterRow = ({ label, children }: Props) => {
  return (
    <View className={FILTER_ROW}>
      {/* Each control says its own name to readers */}
      <Text
        accessibilityElementsHidden
        importantForAccessibility="no"
        className={FILTER_LABEL}
      >
        {label}
      </Text>
      {children}
    </View>
  );
};

export default FilterRow;
