import React from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import PlayerHeadshot from '@/components/pitch/PlayerHeadshot';
import { Badge } from '@/components/ui/badge';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { pressHaptic } from '@/lib/haptics';
import { suggestionListHeight } from '@/lib/suggestion-list';
import type { Suggestion } from '@/lib/suggestions';
import { cn } from '@/lib/utils';

const HEADSHOT_DIAMETER = 32;

type Props = {
  suggestions: readonly Suggestion[];
  onPick: (suggestion: Suggestion) => void;
  // The demo's driven row, picked out in the brand fill
  highlightedKey?: string | null;
};

// A typing aid only: a pick is sent as plain text, the server decides
const SuggestionList = ({
  suggestions,
  onPick,
  highlightedKey = null,
}: Props) => {
  const { height } = useWindowDimensions();

  return (
    <ShadowBox className="overflow-hidden border-2 border-line bg-surface-card">
      <ScrollView
        accessibilityLabel="Suggested players"
        // A row tap must never take the keyboard down
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        // Three rows, two on a short phone: known only at run time
        style={{ maxHeight: suggestionListHeight(height) }}
      >
        {suggestions.map((suggestion, index) => {
          const { player, isNamed } = suggestion;
          const isLast = index === suggestions.length - 1;
          const isHighlighted = player.key === highlightedKey;
          return (
            <Pressable
              key={player.key}
              accessibilityRole="button"
              accessibilityLabel={
                isNamed ? `${player.name}, named` : player.name
              }
              accessibilityState={{ disabled: isNamed }}
              disabled={isNamed}
              onPressIn={pressHaptic}
              onPress={() => onPick(suggestion)}
              className={cn(
                'min-h-11 flex-row items-center gap-3 px-3 active:bg-surface-raised',
                !isLast && 'border-b-2 border-rule',
                isHighlighted && 'bg-brand',
              )}
            >
              <PlayerHeadshot
                name={player.name}
                imageUrl={player.imageUrl}
                diameter={HEADSHOT_DIAMETER}
                className={isNamed ? 'opacity-60' : undefined}
              />
              <Text
                numberOfLines={1}
                className={cn(
                  'min-w-0 flex-1 font-body-medium text-14',
                  isNamed ? 'text-fg-muted' : 'text-fg',
                )}
              >
                {player.name}
              </Text>
              {/* The badge aligns itself to the top; the wrapper centres it */}
              {isNamed ? (
                <View>
                  <Badge tone="grey" label="Named" />
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </ShadowBox>
  );
};

export default SuggestionList;
