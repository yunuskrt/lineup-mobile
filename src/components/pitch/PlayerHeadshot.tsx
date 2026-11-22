import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import type { DuelActor } from '@/types/duel';

type Props = {
  name: string;
  imageUrl: string | null;
  diameter: number;
  // Duel only: fills the disc in the finder's colour
  foundBy?: DuelActor;
  className?: string;
};

// The photo from the CDN, never proxied; initials under it, as on web
const PlayerHeadshot = ({
  name,
  imageUrl,
  diameter,
  foundBy,
  className,
}: Props) => {
  return (
    <Avatar
      name={name}
      source={imageUrl ? { uri: imageUrl } : undefined}
      tone={foundBy ?? 'neutral'}
      diameter={diameter}
      isDecorative
      className={className}
    />
  );
};

export default PlayerHeadshot;
