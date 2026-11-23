import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import CompetitionLogo from '@/components/game/CompetitionLogo';
import CompetitionGroup from '@/components/play/filter-panel/CompetitionGroup';
import FilterRow from '@/components/play/filter-panel/FilterRow';
import OptionRow from '@/components/play/filter-panel/OptionRow';
import SheetTrigger from '@/components/play/filter-panel/SheetTrigger';
import type { FilterPanelProps } from '@/components/play/FilterPanel';
import { Sheet } from '@/components/ui/sheet';
import {
  competitionGroups,
  pickedCompetition,
  selectCompetition,
} from '@/lib/filters';
import { SELECT_SEARCH_FROM } from '@/lib/select';

type Props = FilterPanelProps;

// A single pick: it fits the era and drops clubs outside it
const CompetitionFilter = ({ options, filters, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const picked = pickedCompetition(filters, options);
  const groups = competitionGroups(options.competitions);
  const rowCount = 1 + groups.length + options.competitions.length;

  function choose(id: string | null) {
    onChange(selectCompetition(filters, id, options));
    setIsOpen(false);
  }

  return (
    <FilterRow label="Competition">
      <SheetTrigger
        name="Competition"
        value={picked?.name ?? 'Any'}
        onPress={() => setIsOpen(true)}
      />
      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Competition"
        isTall={rowCount >= SELECT_SEARCH_FROM}
      >
        <ScrollView className={rowCount >= SELECT_SEARCH_FROM ? 'flex-1' : ''}>
          <OptionRow
            label="Any competition"
            kind="radio"
            isChecked={picked === null}
            onPress={() => choose(null)}
          />
          {groups.map((group) => (
            <CompetitionGroup key={group.label} label={group.label}>
              {group.competitions.map((competition) => (
                <OptionRow
                  key={competition.id}
                  label={competition.name}
                  kind="radio"
                  isChecked={picked?.id === competition.id}
                  onPress={() => choose(competition.id)}
                  image={
                    <CompetitionLogo competition={competition} size={20} />
                  }
                />
              ))}
            </CompetitionGroup>
          ))}
        </ScrollView>
      </Sheet>
    </FilterRow>
  );
};

export default CompetitionFilter;
