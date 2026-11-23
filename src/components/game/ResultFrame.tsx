import React, { type ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

type Props = {
  children: ReactNode;
  // The pinned row under the scroll
  actions: ReactNode;
  // Clears the home indicator under the pinned row
  bottomInset: number;
};

// The rail once a game ends: it scrolls over a pinned row of actions
const ResultFrame = ({ children, actions, bottomInset }: Props) => {
  return (
    <View className="flex-1">
      <ScrollView className="flex-1" contentContainerClassName="pb-4">
        {children}
      </ScrollView>
      <View
        className="border-t-2 border-line px-4 pt-3"
        // The home indicator's inset is known only at run time
        style={{ paddingBottom: bottomInset }}
      >
        {actions}
      </View>
    </View>
  );
};

export default ResultFrame;
