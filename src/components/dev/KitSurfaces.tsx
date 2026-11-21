import React, { type ReactNode, useState } from 'react';
import { View } from 'react-native';
import { CircleAlert, Inbox, Info, Trophy } from 'lucide-react-native';
import { DevSection } from '@/components/dev/DevSection';
import RetryNotice from '@/components/shell/RetryNotice';
import StateNotice from '@/components/shell/StateNotice';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Empty } from '@/components/ui/empty';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { Toast } from '@/components/ui/toast';
import { SECTION_LABEL } from '@/styles/classes';
import type { ToastMessage } from '@/types/feedback';
import type { SelectOption } from '@/types/select';

const COMPETITIONS: SelectOption[] = [
  { id: 'pl', label: 'Premier League' },
  { id: 'ucl', label: 'Champions League' },
  { id: 'euro', label: 'Euro' },
];

// 40 rows: the native sheet's keyboard and scrolling spike
const CLUBS: SelectOption[] = [
  'Ajax',
  'Arsenal',
  'Aston Villa',
  'Atalanta',
  'Atlético Madrid',
  'Barcelona',
  'Bayer Leverkusen',
  'Bayern München',
  'Benfica',
  'Beşiktaş',
  'Borussia Dortmund',
  'Celtic',
  'Chelsea',
  'Everton',
  'Fenerbahçe',
  'Feyenoord',
  'Fiorentina',
  'Galatasaray',
  'Inter',
  'Juventus',
  'Lazio',
  'Lille',
  'Liverpool',
  'Lyon',
  'Manchester City',
  'Manchester United',
  'Marseille',
  'Milan',
  'Monaco',
  'Napoli',
  'Newcastle United',
  'Paris Saint-Germain',
  'Porto',
  'PSV',
  'Real Madrid',
  'Roma',
  'Sevilla',
  'Sporting CP',
  'Tottenham Hotspur',
  'Valencia',
].map((label) => ({ id: label.toLowerCase(), label }));

type LabelledProps = { label: string; children: ReactNode };

const Labelled = ({ label, children }: LabelledProps) => {
  return (
    <View className="gap-2">
      <Text className={SECTION_LABEL}>{label}</Text>
      {children}
    </View>
  );
};

type DialogDemoProps = {};

const DialogDemo = ({}: DialogDemoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        label="Open dialog"
        variant="secondary"
        onPress={() => setIsOpen(true)}
      />
      <Dialog
        isOpen={isOpen}
        title="Quit this run?"
        message="You'll see the summary. This run counts toward today's five."
        onCancel={() => setIsOpen(false)}
      >
        <Button label="Keep playing" onPress={() => setIsOpen(false)} />
        <Button
          label="Quit run"
          variant="secondary"
          onPress={() => setIsOpen(false)}
        />
      </Dialog>
    </>
  );
};

type ToastDemoProps = {};

const ToastDemo = ({}: ToastDemoProps) => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  return (
    <View className="gap-3">
      <Toast toast={toast} />
      <Button
        label="Show toast"
        variant="secondary"
        onPress={() =>
          setToast({ id: (toast?.id ?? 0) + 1, message: 'Already named' })
        }
      />
    </View>
  );
};

type SelectDemoProps = {};

const SelectDemo = ({}: SelectDemoProps) => {
  const [competitions, setCompetitions] = useState<string[]>([]);
  const [clubs, setClubs] = useState<string[]>(['liverpool']);
  return (
    <View className="gap-4">
      <Labelled label="Short: fits its content">
        <Select
          label="Competition"
          options={COMPETITIONS}
          selected={competitions}
          onChange={setCompetitions}
        />
      </Labelled>
      <Labelled label="Long: search and 40 rows">
        <Select
          label="Club"
          options={CLUBS}
          selected={clubs}
          onChange={setClubs}
          searchPlaceholder="Search clubs"
        />
      </Labelled>
    </View>
  );
};

type SurfaceSectionsProps = { only?: string };

// M04b's sections of /dev/kit
export const SurfaceSections = ({ only }: SurfaceSectionsProps) => {
  return (
    <>
      <DevSection id="alerts" title="Alerts" only={only}>
        <Alert icon={CircleAlert} title="Couldn't join">
          That room is full. Ask your friend for a new code.
        </Alert>
        <Alert tone="neutral" icon={Info}>
          Duels use the room creator’s filters.
        </Alert>
      </DevSection>

      <DevSection id="empty" title="Empty" only={only}>
        <Empty
          icon={Inbox}
          title="No runs yet"
          message="Your solo runs land here."
        />
        <Empty icon={Trophy} message="Name all eleven for a perfect clear.">
          <Button label="Play solo" />
        </Empty>
      </DevSection>

      <DevSection id="notices" title="Notices" only={only}>
        <StateNotice
          tone="info"
          icon={Info}
          title="Nothing to show"
          message="Widen the era to see more matches."
          isCompact
        />
        <RetryNotice
          title="Couldn't load your profile"
          message="Check your connection."
          onRetry={() => {}}
        />
      </DevSection>

      <DevSection id="avatars" title="Avatars" only={only}>
        <Labelled label="Image · initials · failed image">
          <View className="flex-row items-center gap-4">
            <Avatar
              name="Lineup"
              source={require('@/assets/images/icon.png')}
            />
            <Avatar name="Thiago Silva" />
            <Avatar
              name="Édouard Mendy"
              source={{ uri: 'https://invalid.example/x.png' }}
            />
          </View>
        </Labelled>
        <Labelled label="Tones and sizes">
          <View className="flex-row items-center gap-4">
            <Avatar name="Ada You" tone="you" size="sm" />
            <Avatar name="Ozan Opp" tone="opponent" />
            <Avatar name="İlkay Gündoğan" size="lg" />
          </View>
        </Labelled>
      </DevSection>

      <DevSection id="skeleton" title="Skeleton" only={only}>
        <View className="flex-row items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </View>
        </View>
        <Skeleton className="h-12 w-full" />
      </DevSection>

      <DevSection id="dialog" title="Dialog" only={only}>
        <DialogDemo />
      </DevSection>

      <DevSection id="toast" title="Toast" only={only}>
        <ToastDemo />
      </DevSection>

      <DevSection id="select" title="Select" only={only}>
        <SelectDemo />
      </DevSection>
    </>
  );
};
