import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SECTION_LABEL } from '@/styles/classes';

type Props = {
  label: string;
  children: ReactNode;
};

const CompetitionGroup = ({ label, children }: Props) => {
  return (
    <View>
      <Text accessibilityRole="header" className={`${SECTION_LABEL} pt-4`}>
        {label}
      </Text>
      {children}
    </View>
  );
};

export default CompetitionGroup;
