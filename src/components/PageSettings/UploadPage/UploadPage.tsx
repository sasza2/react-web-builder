import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from 'types';

import { LinkGhostButton } from '@/components/Button';
import { Description, FormGroup, FormHeader } from '@/components/forms/FormControl.styled';
import { useRestartTemplate } from '@/components/Grid/RestartTemplate';

export function UploadPage() {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const restartTemplate = useRestartTemplate();

  useEffect(() => {
    const fileNode = fileRef.current;
    if (!fileNode) return;

    const onChange = (changeEvent: Event) => {
      const target = changeEvent.target as HTMLInputElement;
      if (!target) return;

      const file = target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          restartTemplate(JSON.parse(e.target.result as string) as Page);
        };

        reader.readAsText(file);
      }
    };

    fileNode.addEventListener('change', onChange);

    return () => {
      fileNode.removeEventListener('change', onChange);
    };
  }, []);

  const onUploadClick = () => {
    fileRef.current.click();
  };

  return (
    <FormGroup>
      <FormHeader>
        {t('page.settings.upload.title')}
      </FormHeader>
      <Description>
        {t('page.settings.upload.description')}
      </Description>
      <LinkGhostButton
        onClick={onUploadClick}
      >
        {t('page.settings.upload.title')}
      </LinkGhostButton>
      <input ref={fileRef} type="file" style={{ display: 'none' }} />
    </FormGroup>
  );
}
