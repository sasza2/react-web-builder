import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Breakpoint, Padding as IPadding } from 'types';

import { FieldProvider } from '@/components/FormProvider';
import { useSelectedContainer } from '@/hooks/container/useSelectedContainer';
import { useUpdateBreakpoint } from '@/hooks/useUpdateBreakpoint';
import { assignTestProp } from '@/utils/tests';

import { ColorPicker } from '../ColorPicker';
import { FormGroup, FormHeader } from '../FormControl.styled';
import { Input } from '../Input';
import { Padding } from '../Padding';
import { IFormControl } from '../types';

type EditBreakpointFieldProps <T extends keyof Breakpoint> = {
  field: T,
} & IFormControl;

export function EditBreakpointField<T extends keyof Breakpoint>({
  field,
  testId,
}: EditBreakpointFieldProps<T>) {
  const { t } = useTranslation();
  const [, container] = useSelectedContainer();

  const value = container[field];
  const updateBreakpoint = useUpdateBreakpoint();

  const setValue = useCallback((nextValue: unknown) => {
    updateBreakpoint(container.id, { [field]: nextValue });
  }, [container.id, updateBreakpoint]);

  const setPadding = useCallback((nextPadding: IPadding) => {
    setValue(nextPadding);
  }, [setValue, value]);

  const setCols = useCallback((cols: unknown) => {
    setValue(parseInt(cols as string));
  }, [setValue]);

  const renderField = useMemo(() => {
    switch (field) {
      case 'backgroundColor':
        return (
          <FormGroup {...assignTestProp(testId)}>
            <FormHeader>
              {t('breakpoint.background')}
            </FormHeader>
            <FieldProvider
              name={field}
              setValue={setValue}
              value={value}
            >
              <ColorPicker
                allowGradient
                name={field}
                onBlur={setValue as (backgroundColor: string) => void}
                sketchLabel={t('breakpoint.background')}
              />
            </FieldProvider>
          </FormGroup>
        );
      case 'padding':
        return (
          <FieldProvider
            name={field}
            setValue={setPadding}
            value={value as IPadding}
          >
            <Padding
              name={field}
            />
          </FieldProvider>
        );
      case 'cols':
        return (
          <FormGroup {...assignTestProp(testId)}>
            <FormHeader>
              {t('breakpoint.numberOfColumns')}
            </FormHeader>
            <FieldProvider
              name={field}
              setValue={setCols}
              value={value}
            >
              <Input
                name={field}
              />
            </FieldProvider>
          </FormGroup>
        );
      default:
        return null;
    }
  }, [field, setPadding, setValue, value]);

  if (!container) return null;
  return renderField;
}
