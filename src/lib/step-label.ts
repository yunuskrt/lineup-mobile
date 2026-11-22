import { PLAY_STEPS } from '@/lib/play-steps';

type StepLabelParts = {
  index: number;
  name: string;
  choice?: string;
  isCurrent: boolean;
  isDone: boolean;
};

// The pill read aloud: the web's number, name, choice and step state
export function stepLabel({
  index,
  name,
  choice,
  isCurrent,
  isDone,
}: StepLabelParts): string {
  const parts = [`Step ${index + 1} of ${PLAY_STEPS.length}`, name];
  if (choice) parts.push(choice);
  if (isCurrent) parts.push('current');
  else if (isDone) parts.push('done');
  return parts.join(', ');
}
