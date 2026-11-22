import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import PitchEnd from '@/components/pitch/pitch/PitchEnd';
import { SPOT, strokeFor } from '@/components/pitch/pitch/styles';
import { ROLES } from '@/styles/tokens';

// Mown checks inside the lines, as the web's game/02-pitch-b
const CHECK_COLUMNS = 8;
const CHECK_ROWS = 10;
const CHECK_WIDTH = 96 / CHECK_COLUMNS;
const CHECK_HEIGHT = 116 / CHECK_ROWS;
const CHECKS = Array.from(
  { length: CHECK_COLUMNS * CHECK_ROWS },
  (_, index) => ({
    column: index % CHECK_COLUMNS,
    row: Math.floor(index / CHECK_COLUMNS),
  }),
).filter(({ column, row }) => (column + row) % 2 === 0);

const CORNER_RADIUS = 1.5;
const NEAR = 2 + CORNER_RADIUS;
const FAR_X = 98 - CORNER_RADIUS;
const FAR_Y = 118 - CORNER_RADIUS;
const CORNER_ARCS = [
  `M 2 ${NEAR} A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 0 ${NEAR} 2`,
  `M ${FAR_X} 2 A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 0 98 ${NEAR}`,
  `M 98 ${FAR_Y} A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 0 ${FAR_X} 118`,
  `M ${NEAR} 118 A ${CORNER_RADIUS} ${CORNER_RADIUS} 0 0 0 2 ${FAR_Y}`,
];

type Props = {
  width: number;
  height: number;
};

// Always upright: the goal the XI defends is at the bottom
const Pitch = ({ width, height }: Props) => {
  const stroke = strokeFor(width);
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 120"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Rect width={100} height={120} fill={ROLES.turf} />
      {CHECKS.map(({ column, row }) => (
        <Rect
          key={`${column}-${row}`}
          x={2 + column * CHECK_WIDTH}
          y={2 + row * CHECK_HEIGHT}
          width={CHECK_WIDTH}
          height={CHECK_HEIGHT}
          fill={ROLES['turf-check']}
        />
      ))}
      <Rect x={2} y={2} width={96} height={116} {...stroke} />
      <Line x1={2} y1={60} x2={98} y2={60} {...stroke} />
      <Circle cx={50} cy={60} r={12} {...stroke} />
      <Circle cx={50} cy={60} r={0.8} {...SPOT} />
      {CORNER_ARCS.map((d) => (
        <Path key={d} d={d} {...stroke} />
      ))}
      <PitchEnd goalLineY={2} direction={1} pitchWidth={width} />
      <PitchEnd goalLineY={118} direction={-1} pitchWidth={width} />
    </Svg>
  );
};

export default Pitch;
