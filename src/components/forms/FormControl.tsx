import React, { useMemo } from 'react';

import { assignTestProp } from '@/utils/tests';
import { IFormControl } from './types';
import {
  Description, FormControlDiv, Label, ListErrors,
} from './FormControl.styled';

export function FormControl({
  children,
  description,
  name,
  errors,
  label,
  testId,
}: React.PropsWithChildren<IFormControl>) {
  const error = useMemo(() => {
    if (!name) return null;
    if (!Array.isArray(errors)) return null;

    const errorByName = errors.filter((errorItem) => errorItem.name === name);
    if (!errorByName.length) return null;

    return (
      <ListErrors data-builder-error="true">
        {errorByName.map(({ error: itemError }, index) => ( // eslint-disable-next-line
          <li key={`${itemError}-${index}`}>{itemError}</li>
        ))}
      </ListErrors>
    );
  }, [errors, name]);

  return (
    <FormControlDiv {...assignTestProp(testId)}>
      { label && <Label>{label}</Label> }
      { description && <Description>{description}</Description> }
      {children}
      {error}
    </FormControlDiv>
  );
}
