import React, { useRef, useState } from 'react';
import { useSlate } from 'slate-react';
import { t } from 'i18next';

import { FieldProvider } from '@/components/FormProvider';
import { RenderInSidebarModal } from '@/components/RenderInSidebarModal';
import { toggleColor, getColorActive } from '../utils';
import { Button } from '../buttons';
import { Container, ColorIcon } from './ColorSelect.styled';
import { ColorPicker } from '../../ColorPicker';
import { FormHeader } from '../../FormControl.styled';

export function ColorSelect() {
  const editor = useSlate();
  const color = getColorActive(editor);
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const onClose = () => setOpen(false);

  return (
    <Container>
      <Button
        icon={<ColorIcon style={{ background: color }} />}
        onClick={() => setOpen(true)}
        ref={buttonRef}
      />
      <RenderInSidebarModal
        onClose={onClose}
        open={open}
        opener={buttonRef}
        closeOnlyOnClickOutsideSidebarModal
      >
        <FormHeader>
          {t('color.font')}
        </FormHeader>
        <FieldProvider
          name="color"
          setValue={(nextColor) => {
            toggleColor(editor, nextColor);
          }}
          value={color}
        >
          <ColorPicker
            name="color"
            sketchLabel={t('color.font')}
          />
        </FieldProvider>
      </RenderInSidebarModal>
    </Container>
  );
}
