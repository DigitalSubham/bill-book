import React from 'react';
import Header from '../components/common/Header';

type HeaderConfig = {
  title: string;
  rightActions?: Array<{
    icon: string;
    onPress: () => void;
  }>;
};

export const buildHeaderOptions = ({ title, rightActions }: HeaderConfig) => ({
  header: ({ navigation, back }: any) => (
    <Header
      title={title}
      onBack={back ? () => navigation.goBack() : undefined}
      rightActions={rightActions}
    />
  ),
});
