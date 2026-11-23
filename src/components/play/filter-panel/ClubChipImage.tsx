import React from 'react';
import Svg, { Path } from 'react-native-svg';
import FilterChipImage from '@/components/play/FilterChipImage';
import { SHIELD_PATH } from '@/components/play/filter-icons';
import { ROLES } from '@/styles/tokens';
import type { ClubRef } from '@/types/match';

type Props = { club: ClubRef };

const ClubChipImage = ({ club }: Props) => {
  return (
    <FilterChipImage
      src={club.crestUrl}
      fallback={
        <Svg width="100%" height="100%" viewBox="0 0 24 24">
          <Path d={SHIELD_PATH} fill={ROLES['fg-dim']} />
        </Svg>
      }
    />
  );
};

export default ClubChipImage;
