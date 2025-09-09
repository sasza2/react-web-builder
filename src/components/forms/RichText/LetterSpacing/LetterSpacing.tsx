import React from 'react';
import { useSlate } from 'slate-react';
import type { Option } from 'types';

import { FieldProvider } from '@/components/FormProvider';
import { Icon } from '@/components/icons/Icon';

import { Select } from '../../Select';
import { Container } from '../LineHeight/LineHeight.styled';
import { getLetterSpacing } from '../utils/getLetterSpacing';
import { toggleLetterSpacing } from '../utils/toggleLetterSpacing';

export const LETTER_SPACINGS: Option<string>[] = [];

const addLetterSpacing = (from: number, to: number, inc: number) => {
  for (let size = from; size <= to; size += inc) {
    let sizeStr = `${size / 10}`;
    if (!sizeStr.includes('.')) sizeStr += '.0';
    LETTER_SPACINGS.push({
      label: sizeStr,
      value: `${sizeStr}px`,
    });
  }
};

LETTER_SPACINGS.push({
  label: '-', // TODO
  value: 'normal',
});
addLetterSpacing(0, 10, 1);
addLetterSpacing(12, 20, 1);
addLetterSpacing(25, 50, 5);
addLetterSpacing(60, 100, 10);

export function LetterSpacingSelect() {
  const editor = useSlate();
  return (
    <Container>
      <FieldProvider
        name="letterSpacing"
        setValue={(letterSpacing) => {
          toggleLetterSpacing(editor, letterSpacing as unknown as string);
        }}
        value={getLetterSpacing(editor)}
      >
        <Select
          name="letterSpacing"
          options={LETTER_SPACINGS}
          size="xs"
        />
      </FieldProvider>
      <Icon icon={Icon.LetterSpacing} />
    </Container>
  );
}
