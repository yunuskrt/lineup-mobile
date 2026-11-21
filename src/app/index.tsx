import React from 'react';
import { Redirect } from 'expo-router';

type Props = {};

// M07 shows the welcome here on first launch
const IndexScreen = ({}: Props) => {
  return <Redirect href="/play" />;
};

export default IndexScreen;
