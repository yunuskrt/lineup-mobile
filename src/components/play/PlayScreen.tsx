import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import LaterStep from '@/components/play/LaterStep';
import ModeStep from '@/components/play/ModeStep';
import PlaySteps from '@/components/play/PlaySteps';
import SoloAllowanceNote from '@/components/play/SoloAllowanceNote';
import Screen from '@/components/shell/Screen';
import { useFilterOptions } from '@/hooks/use-filter-options';
import { useProAccess } from '@/hooks/use-pro';
import { useSoloAllowance } from '@/hooks/use-solo-allowance';
import { useStepBack } from '@/hooks/use-step-back';
import { filtersFromParams, filtersToParams } from '@/lib/filters';
import {
  MODE_OPTION_NAMES,
  modeOptionFrom,
  PLAY_STEPS,
  type PlayStep,
  playStepFrom,
  withModeOption,
  withStep,
} from '@/lib/play-steps';
import { routeParamsFor, sameParams, searchParamsOf } from '@/lib/route-params';
import { allowanceLine, isSoloCapped } from '@/lib/solo-allowance';
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
  const paramsQuery = params.toString();
  const stateQuery = queryFor(step).toString();
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

  function goTo(nextStep: PlayStep) {
    if (nextStep === step) return;
    if (nextStep !== 'mode') setHasSeenFilters(true);
    setHasMoved(true);
    write(queryFor(nextStep));
  }

  function changeOption(next: ModeOption) {
    write(queryFor(step, next));
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

  return (
    <Screen
      title="Play"
      hasTabBar
      canGoBack={goBack !== null}
      onBack={goBack ?? undefined}
      scrollResetKey={step}
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
          practiceAccess={practiceAccess}
          allowance={allowanceNote}
          onNext={() => goTo('filters')}
          isHeadingFocused={hasMoved}
        />
      ) : null}
      {step === 'filters' ? (
        <LaterStep
          title="Choose filters"
          builtIn="M13b: the filters"
          onBack={() => goTo('mode')}
          nextLabel="Next: start"
          onNext={() => goTo('start')}
          isNextDisabled={!filters}
          isHeadingFocused={hasMoved}
        />
      ) : null}
      {step === 'start' ? (
        <LaterStep
          title="Ready to play"
          builtIn="M13c: the start"
          onBack={() => goTo('filters')}
          isHeadingFocused={hasMoved}
        />
      ) : null}
    </Screen>
  );
};

export default PlayScreen;
