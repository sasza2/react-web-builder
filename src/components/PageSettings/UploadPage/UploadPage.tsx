import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { Page } from 'types';

import { LinkGhostButton } from '@/components/Button';
import { Description, FormGroup, FormHeader } from '@/components/forms/FormControl.styled';
import { useRestartTemplate } from '@/components/Grid/RestartTemplate';
import { useValidatePage } from '@/hooks/page/useValidatePage';
import { withResolvers } from '@/utils/promise';

export function UploadPage() {
  const { t } = useTranslation();
  const fileRef = useRef<HTMLInputElement>(null);
  const restartTemplate = useRestartTemplate();
  const validatePage = useValidatePage();

  useEffect(() => {
    const fileNode = fileRef.current;
    if (!fileNode) return;

    const onChange = (changeEvent: Event) => {
      const { promise, resolve, reject } = withResolvers();

      toast.promise(
        promise,
        {
          success: t('page.settings.upload.success'),
          error: t('errors.somethingWentWrong'),
        },
        {
          draggable: false,
        },
      );

      const target = changeEvent.target as HTMLInputElement;
      if (!target) {
        reject();
        return;
      }

      const file = target.files[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          let page: Page | null = null;
          try {
            page = JSON.parse(e.target.result as string) as Page;
          } catch {
            reject();
            return;
          }

          if (!page || !validatePage(page)) {
            reject();
            return;
          }

          restartTemplate(page)
            .then(resolve)
            .catch(reject);
        };

        reader.onerror = () => reject();

        reader.readAsText(file);
      } else {
        reject();
      }
    };

    fileNode.addEventListener('change', onChange);

    return () => {
      fileNode.removeEventListener('change', onChange);
    };
  }, [restartTemplate, t, validatePage]);

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
