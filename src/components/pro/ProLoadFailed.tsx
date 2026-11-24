import React from 'react';
import { leavePro } from '@/components/pro/shared';
import RetryNotice from '@/components/shell/RetryNotice';
import Screen from '@/components/shell/Screen';

type Props = { message: string; onRetry: () => void };

// The split is unknown, so the page can't say Pro yet
const ProLoadFailed = ({ message, onRetry }: Props) => {
  return (
    <Screen canGoBack onBack={leavePro}>
      <RetryNotice message={message} onRetry={onRetry} />
    </Screen>
  );
};

export default ProLoadFailed;
