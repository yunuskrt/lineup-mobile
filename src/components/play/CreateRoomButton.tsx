import React from 'react';
import { HOST_CAPTION } from '@/components/play/shared';
import ProLockButton from '@/components/pro/ProLockButton';
import { Button } from '@/components/ui/button';
import type { CreateRoomState } from '@/types/create-room';
import type { ProLockSize } from '@/types/pro-lock';

type Props = {
  room: CreateRoomState;
  // Default beside Start on a short screen
  size?: ProLockSize;
};

// The real button when hosting is open, else the inert lock
const CreateRoomButton = ({ room, size = 'large' }: Props) => {
  if (room.hostAccess !== 'open') {
    return (
      <ProLockButton
        label="Create room"
        size={size}
        caption={room.hostAccess === 'locked' ? HOST_CAPTION : undefined}
      />
    );
  }
  return (
    <Button
      label={room.isBusy ? 'Creating…' : 'Create room'}
      variant="secondary"
      size={size}
      isDisabled={!room.canCreate || room.isBusy}
      onPress={room.create}
    />
  );
};

export default CreateRoomButton;
