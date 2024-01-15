import React from 'react';

import { useConfiguration } from '../ConfigurationProvider';
import { Hints } from './Hints';
import { useBuilderHintsList } from './useBuilderHintsList';

export function BuilderHints() {
  const list = useBuilderHintsList();
  const { builderHintsId } = useConfiguration();

  return (
    <Hints key={builderHintsId} list={list} speed={0} />
  );
}
