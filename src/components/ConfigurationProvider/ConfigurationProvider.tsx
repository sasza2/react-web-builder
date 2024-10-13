import React, {
  createContext, useContext, useMemo, useState,
} from 'react';
import { Configuration } from 'types';

type ConfigurationContextType = {
  configuration: Configuration,
  setConfiguration: (configuration: Configuration) => void,
};

const defaultValues: Configuration = {
  autoFocusRichTextInEditProperties: true,
  autoSave: false,
  bringElementsAbove: true,
  gridZoomingInCenter: false,
  helpLines: true,
  panZoomScroll: false,
  builderHintsId: 0,
  scrollSpeed: 3,
  editOnDoubleClick: false,
  preventCloseEditOnClick: false,
};

const ConfigurationContext = createContext({} as ConfigurationContextType);

export const useConfiguration = (): Configuration => {
  const { configuration } = useContext(ConfigurationContext);
  return configuration;
};

export const useSetConfiguration = () => {
  const { setConfiguration } = useContext(ConfigurationContext);

  const set = (configuration: Configuration) => {
    localStorage.setItem('configuration', JSON.stringify(configuration));
    setConfiguration(configuration);
  };

  return set;
};

export function ConfigurationProvider({ children }: React.PropsWithChildren) {
  const [configuration, setConfiguration] = useState<Configuration>(() => {
    const configurationFromStore = localStorage.getItem('configuration');
    if (configurationFromStore) {
      return {
        ...defaultValues,
        ...JSON.parse(configurationFromStore) as Configuration,
      };
    }
    return defaultValues;
  });

  const value = useMemo(() => ({
    configuration, setConfiguration,
  }), [configuration, setConfiguration]);

  return (
    <ConfigurationContext.Provider value={value}>
      {children}
    </ConfigurationContext.Provider>
  );
}
