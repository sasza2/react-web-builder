import React, { useEffect } from 'react';

import { useBuildPage } from '@/hooks/page/useBuildPage';
import { useChangesSetIsSaved } from '@/hooks/useChangesSetIsSaved';
import { usePageOnChange } from '@/hooks/usePageOnChange';
import { useAppSelector } from '@/store/useAppSelector';

import { useConfiguration } from '../ConfigurationProvider';
import { useWebBuilderProperties } from '../PropertiesProvider';

export function AutoSave({ children }: React.PropsWithChildren) {
  const build = useBuildPage();
  const changes = useAppSelector((state) => state.changes);
  const onChange = usePageOnChange();
  const { onAutoSave } = useWebBuilderProperties();
  const setIsSaved = useChangesSetIsSaved();
  const configuration = useConfiguration();

  useEffect(() => {
    if (changes.pushKey) onChange();
  }, [changes.pushKey]);

  useEffect(() => {
    if (!configuration.autoSave) return;

    if (changes.pushKey && onAutoSave) {
      onAutoSave(build());
      setIsSaved();
    }
  }, [changes.pushKey, configuration.autoSave, setIsSaved]);

  return children as React.ReactElement;
}
