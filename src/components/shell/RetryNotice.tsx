import React, { type ReactNode } from 'react';
import { TriangleAlert } from 'lucide-react-native';
import StateNotice from '@/components/shell/StateNotice';
import { Button } from '@/components/ui/button';

type Props = {
  message: ReactNode;
  onRetry: () => void;
  title?: string;
};

const RetryNotice = ({ message, onRetry, title }: Props) => {
  return (
    <StateNotice
      tone="error"
      icon={TriangleAlert}
      title={title}
      message={message}
    >
      <Button label="Try again" variant="secondary" onPress={onRetry} />
    </StateNotice>
  );
};

export default RetryNotice;
