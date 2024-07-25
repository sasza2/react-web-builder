import React from 'react';

import { I18nProvider } from '@/components/I18nProvider';
import { StoreProvider } from '@/store/StoreProvider';
import { StyleProvider } from '@/components/StyleProvider';
import { FormProvider, useFormCreator } from '@/components/FormProvider';
import { Radio } from './Radio';

export default { title: 'forms/MultipleChoice' };

function Provider({ children }: React.PropsWithChildren) {
  return (
    <I18nProvider>
      <StoreProvider>
        <StyleProvider>
          {children}
        </StyleProvider>
      </StoreProvider>
    </I18nProvider>
  );
}

export function MultipleChoiceStory() {
  const formCreator = useFormCreator<Record<string, unknown>>(() => ({}));

  return (
    <Provider>
      <FormProvider
        {...formCreator}
      >
        <Radio
          options={[
            {
              label: 'contains',
              type: 'contains',
            },
            {
              type: 'numbers',
            },
          ]}
          name="radio"
        />
      </FormProvider>
    </Provider>
  );
}
