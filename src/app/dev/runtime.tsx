import React from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RUNTIME_CHECKS, runCheck } from '@/lib/dev/runtime-checks';

type Props = {};

const RuntimeScreen = ({}: Props) => {
  const results = RUNTIME_CHECKS.map(runCheck);
  const passed = results.filter((result) => result.ok).length;
  return (
    <SafeAreaView>
      <ScrollView>
        <Text>
          Runtime checks: {passed}/{results.length} pass
        </Text>
        {results.map((result) => (
          <Text key={result.label}>
            {'\n'}
            {result.ok ? 'PASS' : 'FAIL'} {result.label}
            {'\n'}got: {result.actual}
            {result.ok ? '' : `\nwant: ${result.expected}`}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RuntimeScreen;
