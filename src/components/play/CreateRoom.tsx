import React from 'react';
import { View } from 'react-native';
import CreateRoomButton from '@/components/play/CreateRoomButton';
import CreateRoomNotes from '@/components/play/CreateRoomNotes';
import type { CreateRoomState } from '@/types/create-room';

type Props = { room: CreateRoomState };

// Under Start in a duel's footer; a short screen puts it beside Start
const CreateRoom = ({ room }: Props) => {
  return (
    <View className="gap-3">
      <CreateRoomButton room={room} />
      <CreateRoomNotes room={room} />
    </View>
  );
};

export default CreateRoom;
