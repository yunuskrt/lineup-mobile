import React, { useState } from 'react';
import { View } from 'react-native';
import { Ellipsis } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Sheet } from '@/components/ui/sheet';
import { playMatchLabel } from '@/lib/archive';
import type { MatchIdentity } from '@/types/match';

type Props = {
  match: MatchIdentity;
  isDisabled: boolean;
  onPlay: (practice: boolean) => void;
};

// Small phones: Practise moves into a sheet beside Play
const MoreActions = ({ match, isDisabled, onPlay }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  function choose(practice: boolean) {
    setIsOpen(false);
    onPlay(practice);
  }

  return (
    <>
      <Button
        icon={Ellipsis}
        variant="secondary"
        size="icon"
        isDisabled={isDisabled}
        accessibilityLabel={`More for ${match.home.name} v ${match.away.name}`}
        onPress={() => setIsOpen(true)}
      />
      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${match.home.shortName} v ${match.away.shortName}`}
      >
        <View className="gap-3 pb-2">
          <Button
            label="Play"
            size="large"
            accessibilityLabel={playMatchLabel(match, 'Play')}
            onPress={() => choose(false)}
          />
          <Button
            label="Practise"
            variant="secondary"
            size="large"
            accessibilityLabel={playMatchLabel(match, 'Practise')}
            onPress={() => choose(true)}
          />
        </View>
      </Sheet>
    </>
  );
};

export default MoreActions;
