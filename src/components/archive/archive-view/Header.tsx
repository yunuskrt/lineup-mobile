import React from 'react';
import { View } from 'react-native';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useAppConfig } from '@/hooks/use-pro';
import { archiveTotalLine } from '@/lib/archive';
import { showsPro } from '@/lib/pro';
import type { ArchiveView } from '@/types/archive';

const LOCKED_LINE =
  'Every match in the game, searchable. Pick one and play it.';

const LINE = 'text-16 text-fg-muted';

type Props = { view: ArchiveView };

// The screen's top: the Pro sticker, then the total line
const Header = ({ view }: Props) => {
  const config = useAppConfig();
  return (
    <View className="items-start gap-3">
      {/* No word "Pro" while the split is off */}
      {showsPro(config.data ?? null) ? (
        <Badge label="Pro" variant="sticker" tone="brand" />
      ) : null}
      {view.status === 'locked' ? (
        <Text className={LINE}>{LOCKED_LINE}</Text>
      ) : view.total !== null ? (
        <Text accessibilityLiveRegion="polite" className={LINE}>
          {archiveTotalLine(view.total)}
        </Text>
      ) : (
        // The line's own height while the total loads
        <View className="h-6 w-full justify-center">
          <Skeleton className="h-4 w-64" />
        </View>
      )}
    </View>
  );
};

export default Header;
