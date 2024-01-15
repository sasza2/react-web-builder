import React from 'react';

import { TextElement } from 'types';
import { useField } from '@/components/FormProvider';
import { IFormControl } from '../types';
import { FormControl } from '../FormControl';
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
