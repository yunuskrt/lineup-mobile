import React, { useEffect, useEffectEvent, useState } from 'react';
import { View } from 'react-native';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import FiltersActions from '@/components/play/FiltersActions';
import FiltersStep from '@/components/play/FiltersStep';
import ModeStep from '@/components/play/ModeStep';
import PlaySteps from '@/components/play/PlaySteps';
import SoloAllowanceNote from '@/components/play/SoloAllowanceNote';
import StartActions from '@/components/play/StartActions';
import StartStep from '@/components/play/StartStep';
import Screen from '@/components/shell/Screen';
import { Button } from '@/components/ui/button';
import { useFilterOptions } from '@/hooks/use-filter-options';
import { useKeyboardFrame } from '@/hooks/use-keyboard-frame';
import { useProAccess } from '@/hooks/use-pro';
import { useSoloAllowance } from '@/hooks/use-solo-allowance';
import { useStepBack } from '@/hooks/use-step-back';
import { filtersFromParams, filtersToParams } from '@/lib/filters';
import { gameHref } from '@/lib/game-href';
import {
  MODE_OPTION_NAMES,
  modeOptionFrom,
  PLAY_STEPS,
  type PlayStep,
  playStepFrom,
  withModeOption,
  withStep,
} from '@/lib/play-steps';
import {
  hasOpenRun,
  modeOf,
  PRACTICE_OVER_RUN_COPY,
  withPractice,
} from '@/lib/practice';
import { takeHeldRoomCode } from '@/lib/pending-room';
import { joinCodeFrom, withRoom } from '@/lib/room-code';
import {
  paramsKey,
  routeParamsFor,
  sameParams,
  searchParamsOf,
} from '@/lib/route-params';
import { allowanceLine, isSoloCapped } from '@/lib/solo-allowance';
import type { Filters } from '@/types/filters';
import type { ModeOption } from '@/types/play';
import type { RouteParams } from '@/types/route-params';

type Props = {};

// /play's three steps; the route's params hold the step and choices
const PlayScreen = ({}: Props) => {
  const routeParams = useLocalSearchParams<RouteParams>();
  const params = searchParamsOf(routeParams);
  const picked = modeOptionFrom(params);
  const options = useFilterOptions();
  // Practice is Pro (R14); the server still checks
  const practiceAccess = useProAccess();
  // A locked practice pick shows as Solo
  const option: ModeOption | null =
    picked === 'practice' && practiceAccess !== 'open' ? 'solo' : picked;
  const mode = option ? modeOf(option).mode : null;
  const isPractice = option === 'practice';
  // The last code the params brought; the filters rewrite drops it
  const paramsCode = joinCodeFrom(params);
  const [initialCode, setInitialCode] = useState(paramsCode);
  if (paramsCode && paramsCode !== initialCode) setInitialCode(paramsCode);
  // The server's count; nothing while unlimited, nothing for practice
  const allowance = useSoloAllowance();
  const soloAllowance = option === 'solo' ? (allowance.data ?? null) : null;
  const soloLine = allowanceLine(soloAllowance);
  const isCapped = isSoloCapped(soloAllowance);

  const filters = options.data ? filtersFromParams(params, options.data) : null;
  const filterParams =
    filters && options.data ? filtersToParams(filters, options.data) : null;
  const step = playStepFrom(params, picked !== null);
  // Filled once seen; Any is valid but unchosen
  const [hasSeenFilters, setHasSeenFilters] = useState(false);
  // The heading takes focus after a move, never on first load
  const [hasMoved, setHasMoved] = useState(false);
  const progress = {
    hasMode: picked !== null,
    hasFilters: filters !== null && (hasSeenFilters || step !== 'mode'),
  };

  function queryFor(
    nextStep: PlayStep,
    nextPicked = picked,
    base = filterParams ?? params,
  ): URLSearchParams {
    return withStep(withModeOption(base, nextPicked), nextStep);
  }

  // A stale step or unknown filter in the params gives way to the state
  const paramsQuery = paramsKey(params);
  const stateQuery = paramsKey(queryFor(step));
  useEffect(() => {
    if (paramsQuery === stateQuery) return;
    router.setParams(
      routeParamsFor(new URLSearchParams(stateQuery), routeParams),
    );
  }, [paramsQuery, stateQuery, routeParams]);

  function write(next: URLSearchParams) {
    if (sameParams(next, params)) return;
    router.setParams(routeParamsFor(next, routeParams));
  }

  // A room link that came during a game waits for Play to show
  const takeHeldCode = useEffectEvent(() => {
    const code = takeHeldRoomCode();
    if (code) write(withRoom(queryFor('mode', 'duel'), code));
  });
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) takeHeldCode();
  }, [isFocused]);

  function goTo(nextStep: PlayStep) {
    if (nextStep === step) return;
    if (nextStep !== 'mode') setHasSeenFilters(true);
    setHasMoved(true);
    write(queryFor(nextStep));
  }

  function changeOption(next: ModeOption) {
    write(queryFor(step, next));
  }

  // A card tap moves on, as Next would; Back returns with it kept
  function pickOption(next: ModeOption) {
    // A capped Solo stays, to show the cap line and Play a duel
    if (next === 'solo' && isSoloCapped(allowance.data ?? null)) {
      changeOption(next);
      return;
    }
    setHasSeenFilters(true);
    setHasMoved(true);
    write(queryFor('filters', next));
  }

  function changeFilters(next: Filters) {
    if (!options.data) return;
    write(queryFor(step, picked, filtersToParams(next, options.data)));
  }

  const previous = PLAY_STEPS[PLAY_STEPS.indexOf(step) - 1];
  const goBack = previous ? () => goTo(previous) : null;
  useStepBack(goBack);

  const allowanceNote = soloLine ? (
    <SoloAllowanceNote
      line={soloLine}
      isCapped={isCapped}
      onPlayDuel={() => changeOption('duel')}
    />
  ) : null;
  const startParams = filterParams && withPractice(filterParams, isPractice);
  // Typing a code, Join is the way on; Next would cover it on an SE
  const isTypingCode = useKeyboardFrame().isShown && step === 'mode';
  // Each step's way on, pinned above the tab bar
  const footer = isTypingCode ? undefined : step === 'mode' ? (
    <Button
      label="Next: filters"
      size="large"
      isDisabled={!option}
      onPress={() => goTo('filters')}
    />
  ) : step === 'filters' ? (
    <FiltersActions
      canGoNext={filters !== null}
      onBack={() => goTo('mode')}
      onNext={() => goTo('start')}
    />
  ) : option && mode ? (
    <StartActions
      mode={mode}
      filterParams={filterParams}
      href={startParams ? gameHref(mode, startParams) : null}
      isCapped={isCapped}
      label={isPractice ? 'Start practice' : undefined}
      warningFor={() =>
        isPractice && hasOpenRun() ? PRACTICE_OVER_RUN_COPY : null
      }
      allowance={allowanceNote}
      onBack={() => goTo('filters')}
    />
  ) : undefined;

  return (
    <Screen
      hasTabBar
      avoidsKeyboard
      canGoBack={goBack !== null}
      onBack={goBack ?? undefined}
      scrollResetKey={step}
      footer={footer}
    >
      <View>
        <PlaySteps
          current={step}
          progress={progress}
          choices={{
            mode: option ? MODE_OPTION_NAMES[option] : undefined,
            filters: 'Your filters',
          }}
          onGo={goTo}
        />
      </View>
      {step === 'mode' ? (
        <ModeStep
          option={option}
          onChange={changeOption}
          onPick={pickOption}
          practiceAccess={practiceAccess}
          allowance={allowanceNote}
          // Joining is a duel, never practice, whatever card is picked
          joinParams={filterParams && withModeOption(filterParams, 'duel')}
          initialCode={initialCode}
          isHeadingFocused={hasMoved}
        />
      ) : null}
      {step === 'filters' ? (
        <FiltersStep
          filters={filters}
          options={options.data ?? null}
          onChange={changeFilters}
          error={options.error}
          onRetry={() => void options.refetch()}
          isHeadingFocused={hasMoved}
        />
      ) : null}
      {step === 'start' && option && mode ? (
        <StartStep
          option={option}
          mode={mode}
          filters={filters}
          options={options.data ?? null}
          isCapped={isCapped}
          onGo={goTo}
          isHeadingFocused={hasMoved}
        />
      ) : null}
    </Screen>
  );
};

export default PlayScreen;
