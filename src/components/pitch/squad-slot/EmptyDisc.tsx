import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { PERSON_PATH } from '@/components/pitch/person';
import { ROLES } from '@/styles/tokens';

type Props = {
  diameter: number;
};

// A silhouette in a white disc: the slot waits for its player
const EmptyDisc = ({ diameter }: Props) => {
  return (
    <View
      className="items-center justify-center rounded-full border-2 border-line bg-surface-card"
      // The disc's size comes from the formation at run time
      style={{ width: diameter, height: diameter }}
    >
      <Svg width={diameter * 0.6} height={diameter * 0.6} viewBox="0 0 24 24">
        <Path d={PERSON_PATH} fill={ROLES['fg-muted']} />
      </Svg>
    </View>
  );
};

export default EmptyDisc;
