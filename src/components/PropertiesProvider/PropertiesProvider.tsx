import React, { createContext, useContext, useMemo } from 'react';

import {
  BuilderCommonProps, WebBuilderProps, ViewProps, WebBuilderComponent,
} from 'types';
import { mergeArrays } from '@/utils/array';
import { useInternalComponents } from '../../components';

const PropertiesContext = createContext({} as BuilderCommonProps);

export const useProperties = (): BuilderCommonProps => {
  const props = useContext(PropertiesContext);
  return props;
};

export const useViewProperties = () => {
  const props = useContext(PropertiesContext) as ViewProps;
  return props;
};

export const useWebBuilderProperties = (): WebBuilderProps => {
  const props = useContext(PropertiesContext) as WebBuilderProps;
  return props;
};

const mergeItem = (a: WebBuilderComponent, b: WebBuilderComponent) => ({
  ...a,
  ...b,
  props: mergeArrays([a.props, b.props]),
});

function PropertiesProvider({
  children,
  components,
  page,
  ...props
}: React.PropsWithChildren<BuilderCommonProps>) {
  const internalComponents = useInternalComponents({
    components,
    page,
    ...props,
  });
  const allComponents = useMemo(
    () => mergeArrays([internalComponents, components], mergeItem),
    [internalComponents, components],
  );
  const value = useMemo(() => ({
    ...props,
    page,
    components: allComponents,
  }), [page, allComponents]);

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function ViewPropertiesProvider({
  children,
  components,
  ...props
}: React.PropsWithChildren<ViewProps>) {
  return (
    <PropertiesProvider components={components} {...props}>
      {children}
    </PropertiesProvider>
  );
}

export function WebBuilderPropertiesProvider({
  children,
  components,
  ...props
}: React.PropsWithChildren<WebBuilderProps>) {
  return (
    <PropertiesProvider components={components} {...props}>
      {children}
    </PropertiesProvider>
  );
}
