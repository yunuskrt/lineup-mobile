import React from 'react';
import { Circle, Path, Rect } from 'react-native-svg';
import { SPOT, strokeFor } from '@/components/pitch/pitch/styles';

type Props = {
  goalLineY: number;
  direction: 1 | -1;
  pitchWidth: number;
};

const PitchEnd = ({ goalLineY, direction, pitchWidth }: Props) => {
  const stroke = strokeFor(pitchWidth);
  const penaltyEdge = goalLineY + direction * 18;
  const goalAreaEdge = goalLineY + direction * 6;
  const spotY = goalLineY + direction * 12;
  // The arc bulges away from the goal
  const sweep = direction === 1 ? 0 : 1;
  return (
    <>
      <Rect
        x={22}
        y={Math.min(goalLineY, penaltyEdge)}
        width={56}
        height={18}
        {...stroke}
      />
      <Rect
        x={37}
        y={Math.min(goalLineY, goalAreaEdge)}
        width={26}
        height={6}
        {...stroke}
      />
      <Path
        d={`M 42 ${penaltyEdge} A 10 10 0 0 ${sweep} 58 ${penaltyEdge}`}
        {...stroke}
      />
      <Circle cx={50} cy={spotY} r={0.8} {...SPOT} />
    </>
  );
};

export default PitchEnd;
