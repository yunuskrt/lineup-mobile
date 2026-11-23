import React from 'react';
import { HOST_CAPTION } from '@/components/play/shared';
import StartError from '@/components/play/StartError';
import ProLockCaption from '@/components/pro/ProLockCaption';
import type { CreateRoomState } from '@/types/create-room';

type Props = { room: CreateRoomState };

// What goes under Create room: the lock line, or a failed create
const CreateRoomNotes = ({ room }: Props) => {
  return (
    <>
      {room.hostAccess === 'locked' ? (
        <ProLockCaption caption={HOST_CAPTION} />
      ) : null}
      <StartError error={room.error} isBusy={room.isBusy} />
    </>
  );
};

export default CreateRoomNotes;
