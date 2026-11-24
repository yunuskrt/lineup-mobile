import React, { type ReactNode } from 'react';
import FilterRow from '@/components/play/filter-panel/FilterRow';
import SheetTrigger from '@/components/play/filter-panel/SheetTrigger';
import SheetChip from '@/components/play/SheetChip';

type Props = {
  name: string;
  value: string;
  // Not on Any: the chip fills and shows its value
  isActive: boolean;
  count?: number;
  // The archive's chip row instead of a ruled row
  isChip: boolean;
  onPress: () => void;
  // The filter's own sheet
  children: ReactNode;
};

// A filter's control: a ruled select row on /play, a chip on the archive
const FilterTrigger = ({
  name,
  value,
  isActive,
  count,
  isChip,
  onPress,
  children,
}: Props) => {
  if (isChip) {
    return (
      <>
        <SheetChip
          name={name}
          value={value}
          isActive={isActive}
          onPress={onPress}
        />
        {children}
      </>
    );
  }
  return (
    <FilterRow label={name}>
      <SheetTrigger name={name} value={value} count={count} onPress={onPress} />
      {children}
    </FilterRow>
  );
};

export default FilterTrigger;
