import React, { useEffect, useState, type ReactNode } from 'react';
import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClientProvider,
} from '@tanstack/react-query';
import { createQueryClient } from '@/components/providers/query-client';

type Props = {
  children: ReactNode;
};

// Query's browser signals, fed from the phone: foreground and network
const QueryProvider = ({ children }: Props) => {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status) =>
      focusManager.setFocused(status === 'active'),
    );
    // Unknown (null) counts as online, so the first fetch isn't held
    onlineManager.setEventListener((setOnline) =>
      NetInfo.addEventListener((state) =>
        setOnline(state.isConnected !== false),
      ),
    );
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
