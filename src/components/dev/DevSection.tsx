import React, { type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TYPE_SECTION, TYPE_TITLE } from '@/styles/classes';

type DevScreenProps = { title: string; children: ReactNode };

// A dev page: the theme's surface, one scrolling column
export const DevScreen = ({ title, children }: DevScreenProps) => {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView contentContainerClassName="gap-8 px-4 pb-16 pt-4">
        <Text className={`${TYPE_TITLE} text-fg`}>{title}</Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

type DevSectionProps = {
  id: string;
  title: string;
  // ?section= shows one section alone, so each can be screenshotted
  only?: string;
  children: ReactNode;
};

export const DevSection = ({ id, title, only, children }: DevSectionProps) => {
  if (only && only !== id) return null;
  return (
    <View className="gap-4 border-t-2 border-line pt-6">
      <Text className={`${TYPE_SECTION} text-fg`}>{title}</Text>
      {children}
    </View>
  );
};
