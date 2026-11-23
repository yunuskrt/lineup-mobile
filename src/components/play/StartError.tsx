import React, { useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';
import { Text } from '@/components/ui/text';
import { authErrorMessageOf } from '@/lib/auth';

type Props = {
  error: unknown;
  // Hidden while a retry is under way
  isBusy: boolean;
};

const StartError = ({ error, isBusy }: Props) => {
  const message = error && !isBusy ? authErrorMessageOf(error) : null;

  // The web's role="alert": read out as it appears
  useEffect(() => {
    if (message) AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  if (!message) return null;
  return <Text className="text-14 text-danger-text">{message}</Text>;
};

export default StartError;
