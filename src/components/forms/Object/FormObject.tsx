import React from 'react';
import { OnImageUpload, WebBuilderComponentProperty } from 'types';

import { FormProperty } from '@/components/FormProperty';

import { FormGroup, FormHeader } from '../FormControl.styled';
import { IFormControl } from '../types';
import { Container } from './FormObject.styled';

type FormArrayProps = {
  autoFocus?: boolean,
  defaultValue?: unknown,
  formCreatorId: string,
  onImageUpload?: OnImageUpload,
  of: WebBuilderComponentProperty[],
  testId?: string,
} & IFormControl;

export function FormObject({
  autoFocus,
  defaultValue,
  formCreatorId,
  onImageUpload,
  testId,
  label,
  name,
  of,
}: FormArrayProps) {
  return (
    <FormGroup>
      <FormHeader>
        {label}
      </FormHeader>
      <Container>
        {of.map((item, index) => {
          const key = `${JSON.stringify(item)}-${index}`; // eslint-disable-line react/no-array-index-key
          return (
            <FormProperty
              key={key}
              autoFocus={autoFocus}
              defaultValue={defaultValue}
              formCreatorId={formCreatorId}
              onImageUpload={onImageUpload}
              prop={item}
              testId={testId}
              name={`${name}.${item.id}`}
            />
          );
        })}
      </Container>
    </FormGroup>
  );
}

export default FormObject;
