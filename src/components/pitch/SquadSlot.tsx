import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import PlayerHeadshot from '@/components/pitch/PlayerHeadshot';
import EmptyDisc from '@/components/pitch/squad-slot/EmptyDisc';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { DuelActor } from '@/types/duel';
import type { SlotSize } from '@/types/pitch';
import type { PositionGroup } from '@/types/player';

const POSITION_NAMES: Record<PositionGroup, string> = {
  GK: 'Goalkeeper',
  DF: 'Defender',
  MF: 'Midfielder',
  FW: 'Forward',
};

const FINDER_NAMES: Record<DuelActor, string> = {
  you: 'named by you',
  opponent: 'named by your opponent',
};

// Solo labels stay white; a duel marks the finder's colour
const LABEL_FILL: Record<DuelActor | 'solo', string> = {
  solo: 'bg-surface-card',
  you: 'bg-you',
  opponent: 'bg-opponent',
};

const LABEL = 'rounded-sm border-2 px-0.5';

type Props = {
  position: PositionGroup;
  size: SlotSize;
} & (
  | { state: 'loading' }
  | { state: 'empty' }
  // Shown once the run is over, if the server sent it
  | { state: 'missed'; name: string; imageUrl: string | null }
  | {
      state: 'filled';
      name: string;
      imageUrl: string | null;
      foundBy?: DuelActor;
      // Painted under the slot: the reveal flash, the already-named pulse
      backdrop?: ReactNode;
    }
);

type LabelTextProps = {
  size: number;
  className: string;
  children: string;
};

// Fixed-size game pieces: text scaling is capped on the pitch
const LabelText = ({ size, className, children }: LabelTextProps) => {
  return (
    <Text
      numberOfLines={2}
      maxFontSizeMultiplier={1.2}
      className={cn('text-center', className)}
      // The label size follows the pitch width at run time
      style={{ fontSize: size, lineHeight: size * 1.1 }}
    >
      {children}
    </Text>
  );
};

const SquadSlot = (props: Props) => {
  const { position, size } = props;
  const positionName = POSITION_NAMES[position];

  if (props.state === 'loading') {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="items-center gap-0.5"
      >
        <View
          // The disc's size comes from the formation at run time
          style={{ width: size.disc, height: size.disc }}
        >
          <Skeleton className="h-full w-full rounded-full" />
        </View>
        <Skeleton className="h-4 w-3/4 rounded-full" />
      </View>
    );
  }

  if (props.state === 'empty') {
    return (
      <View
        accessible
        accessibilityLabel={`${positionName}, not yet named`}
        className="items-center gap-0.5"
      >
        <EmptyDisc diameter={size.disc} />
        <View
          className={cn(
            LABEL,
            'rounded-full border-line bg-surface-card px-1.5',
          )}
        >
          <LabelText
            size={size.label}
            className="font-body-semibold text-fg-muted"
          >
            {position}
          </LabelText>
        </View>
      </View>
    );
  }

  if (props.state === 'missed') {
    return (
      <View
        accessible
        accessibilityLabel={`${positionName}, ${props.name}, missed`}
        className="items-center gap-0.5"
      >
        <PlayerHeadshot
          name={props.name}
          imageUrl={props.imageUrl}
          diameter={size.disc}
          className="border-dashed border-fg-muted opacity-60"
        />
        <View
          className={cn(
            LABEL,
            'max-w-full border-dashed border-fg-muted bg-turf',
          )}
        >
          <LabelText
            size={size.label}
            className="font-body-medium text-fg-muted"
          >
            {props.name}
          </LabelText>
        </View>
      </View>
    );
  }

  const finder = props.foundBy ? `, ${FINDER_NAMES[props.foundBy]}` : '';
  return (
    <View
      accessible
      accessibilityLabel={`${positionName}, ${props.name}${finder}`}
      className="items-center gap-0.5"
    >
      {props.backdrop}
      <PlayerHeadshot
        name={props.name}
        imageUrl={props.imageUrl}
        diameter={size.disc}
        foundBy={props.foundBy}
      />
      <View className="max-w-full">
        <ShadowBox
          depth="hard-sm"
          radiusClassName="rounded-sm"
          className={cn(
            LABEL,
            'border-line',
            LABEL_FILL[props.foundBy ?? 'solo'],
          )}
        >
          <LabelText
            size={size.label}
            className="font-body-semibold text-on-accent"
          >
            {props.name}
          </LabelText>
        </ShadowBox>
      </View>
    </View>
  );
};

export default SquadSlot;
