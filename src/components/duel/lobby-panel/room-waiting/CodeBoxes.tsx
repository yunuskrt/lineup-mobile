import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { spokenCode } from '@/lib/room-share';
import { TYPE_ROOM_CODE } from '@/styles/classes';

const MAX_FONT_SCALE = 1.2;

type Props = { code: string };

// Six boxes, read aloud letter by letter
const CodeBoxes = ({ code }: Props) => {
  return (
    <View
      accessible
      accessibilityLabel={`Room code ${spokenCode(code)}`}
      className="w-full flex-row justify-center gap-1.5"
    >
      {code.split('').map((char, index) => (
        <View
          key={index}
          className="aspect-square max-w-14 flex-1 items-center justify-center rounded-md border-2 border-line bg-surface-card"
        >
          <Text
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            className={`${TYPE_ROOM_CODE} text-fg`}
          >
            {char}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default CodeBoxes;
