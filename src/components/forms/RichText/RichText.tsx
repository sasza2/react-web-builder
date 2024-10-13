import React from 'react';
import { TextElement } from 'types';

import { useField } from '@/components/FormProvider';

import { FormControl } from '../FormControl';
import { IFormControl } from '../types';
import { Editor } from './Editor/Editor';

 type RichTextProps = {
   autoFocus?: boolean,
   colorAvailable?: boolean,
   hyperlinkAvailable?: boolean,
 } & IFormControl;

export function RichText({
  autoFocus,
  colorAvailable,
  hyperlinkAvailable,
  name,
  errors,
  label,
}: RichTextProps) {
  const { setValue, value } = useField<TextElement[]>(name);

  return (
    <FormControl name={name} errors={errors} label={label}>
      <Editor
        autoFocus={autoFocus}
        colorAvailable={colorAvailable}
        hyperlinkAvailable={hyperlinkAvailable}
        value={value}
        setValue={setValue}
      />
    </FormControl>
  );
}
