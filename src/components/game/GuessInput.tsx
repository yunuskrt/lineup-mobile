import React, {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  AccessibilityInfo,
  TextInput,
  type TextInputInstance,
  View,
} from 'react-native';
import CooldownLine from '@/components/game/guess-input/CooldownLine';
import ShakeFrame from '@/components/game/guess-input/ShakeFrame';
import Spinner from '@/components/game/guess-input/Spinner';
import SuggestionList from '@/components/game/SuggestionList';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { MAX_GUESS_LENGTH } from '@/lib/api/schemas/common';
import { prepareGuess } from '@/lib/guess';
import { type Suggestion, suggestionCountLabel } from '@/lib/suggestions';
import { cooldownAnnouncement } from '@/lib/system-states';
import { cn } from '@/lib/utils';
import { SECTION_LABEL } from '@/styles/classes';
import { SHADOW_HARD_SM } from '@/styles/shadow';
import { ROLES } from '@/styles/tokens';
import type { GuessInputStatus } from '@/types/guess-input';

// Live stands proud on its shadow; the rest sit flat
const STATUS_TEXT: Record<GuessInputStatus, string> = {
  live: 'text-fg',
  pending: 'text-fg-muted',
  locked: 'text-fg-dim',
  cooldown: 'text-fg-muted',
};

const STATUS_SPOKEN: Record<GuessInputStatus, string> = {
  live: '',
  pending: 'Checking',
  locked: 'Locked',
  cooldown: 'Too many guesses, wait',
};

const NO_SUGGESTIONS: readonly Suggestion[] = [];

type Props = {
  status: GuessInputStatus;
  // Required for `cooldown`; the line counts to it
  cooldownUntil?: number;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (guess: string) => void;
  shakeKey: number;
  // Typing aid only; a pick is a plain text guess
  suggestions?: readonly Suggestion[];
  // False under a gate: no focus; true again refocuses a live field
  canFocus?: boolean;
  // The board keeps its layout while the list floats over the turf
  onListOpenChange?: (isOpen: boolean) => void;
  // Between the list and the field: the band's clock row stays put
  header?: ReactNode;
  // The band drops the visible label for room; the field keeps its name
  hasLabel?: boolean;
  // Set by the Welcome's demo: no focus, no touches; it highlights a row
  drivenHighlight?: string | null;
};

const GuessInput = ({
  status,
  cooldownUntil,
  value,
  onValueChange,
  onSubmit,
  shakeKey,
  suggestions = NO_SUGGESTIONS,
  canFocus = true,
  onListOpenChange,
  header,
  hasLabel = true,
  drivenHighlight,
}: Props) => {
  const inputRef = useRef<TextInputInstance>(null);
  const runs = useMotionPolicy();
  const isLive = status === 'live';
  const isCoolingDown = status === 'cooldown' && cooldownUntil !== undefined;
  const [isFocused, setIsFocused] = useState(false);
  // A sent guess closes the list until the text changes
  const [isDismissed, setIsDismissed] = useState(false);
  const isDriven = drivenHighlight !== undefined;
  const isListOpen =
    isLive &&
    (isDriven || (isFocused && !isDismissed)) &&
    suggestions.length > 0;

  useEffect(() => {
    if (isDriven) return;
    if (!canFocus) inputRef.current?.blur();
    else if (isLive) inputRef.current?.focus();
  }, [isLive, canFocus, isDriven]);

  // Before layout events arrive, so the board never sizes to the list
  useLayoutEffect(() => {
    onListOpenChange?.(isListOpen);
    // A field that unmounts mid-list (a pick ends the turn) has no list
    return () => onListOpenChange?.(false);
  }, [isListOpen, onListOpenChange]);

  // A driven field is presentation: it never speaks
  useEffect(() => {
    if (!isListOpen || isDriven) return;
    AccessibilityInfo.announceForAccessibility(
      suggestionCountLabel(suggestions.length),
    );
  }, [isListOpen, isDriven, suggestions.length]);

  // Read once per lockout
  useEffect(() => {
    if (isDriven || status !== 'cooldown' || cooldownUntil === undefined) {
      return;
    }
    AccessibilityInfo.announceForAccessibility(
      cooldownAnnouncement(cooldownUntil - Date.now()),
    );
  }, [status, cooldownUntil, isDriven]);

  function send(text: string) {
    const guess = prepareGuess(text);
    if (guess === null) return;
    setIsDismissed(true);
    onSubmit(guess);
  }

  function pick({ player }: Suggestion) {
    if (!isLive) return;
    onValueChange(player.name);
    send(player.name);
  }

  // Not live: the field keeps focus and the keyboard, and ignores typing
  function handleChange(next: string) {
    if (!isLive) return;
    setIsDismissed(false);
    onValueChange(next);
  }

  return (
    <View pointerEvents={isDriven ? 'none' : 'auto'} className="gap-2">
      {isListOpen ? (
        <SuggestionList
          suggestions={suggestions}
          onPick={pick}
          highlightedKey={drivenHighlight ?? null}
        />
      ) : null}
      {header}
      {hasLabel ? (
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no"
          className={SECTION_LABEL}
        >
          Guess a player
        </Text>
      ) : null}
      <ShakeFrame shakeKey={shakeKey}>
        <View
          className="rounded-md"
          // boxShadow: the live field stands on the small hard shadow
          style={isLive ? SHADOW_HARD_SM : undefined}
        >
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={handleChange}
            onSubmitEditing={() => {
              if (isLive) send(value);
            }}
            editable={!isDriven}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            submitBehavior="submit"
            returnKeyType="send"
            placeholder="Name a player…"
            placeholderTextColor={ROLES['fg-dim']}
            maxLength={MAX_GUESS_LENGTH}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            spellCheck={false}
            accessibilityLabel="Guess a player"
            accessibilityState={{ busy: status === 'pending' }}
            // Words, not `disabled`: Android drops the keyboard for that
            accessibilityValue={{ text: STATUS_SPOKEN[status] }}
            className={cn(
              'h-12 rounded-md border-2 border-line bg-surface-card pl-3 pr-10 font-body-medium text-16',
              STATUS_TEXT[status],
            )}
          />
          {status === 'pending' ? (
            <Spinner isSpinning={runs('inputSpinner')} />
          ) : null}
        </View>
      </ShakeFrame>
      {isCoolingDown ? <CooldownLine until={cooldownUntil} /> : null}
    </View>
  );
};

export default GuessInput;
