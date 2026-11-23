import React from 'react';
import { View } from 'react-native';
import CreateRoomButton from '@/components/play/CreateRoomButton';
import CreateRoomNotes from '@/components/play/CreateRoomNotes';
import { STEP_SECTION } from '@/components/play/styles';
import { Text } from '@/components/ui/text';
import { SECTION_LABEL } from '@/styles/classes';
import type { CreateRoomState } from '@/types/create-room';

type Props = { room: CreateRoomState };

// A duel's own section; a short screen moves the button beside Start
const CreateRoom = ({ room }: Props) => {
  return (
    <View className={STEP_SECTION}>
      <Text accessibilityRole="header" className={SECTION_LABEL}>
        Play a friend
      </Text>
      <View className="gap-3">
        <CreateRoomButton room={room} />
        <CreateRoomNotes room={room} />
      </View>
    </View>
  );
};

export default CreateRoom;
