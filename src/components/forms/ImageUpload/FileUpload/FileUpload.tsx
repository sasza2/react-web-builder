import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { ImageURL, OnImageUpload } from 'types';
import { delay } from '@/utils/delay';
import { useField } from '@/components/FormProvider';
import { LinkButton } from '@/components/Button';
import { LoaderSpinner } from '@/components/LoaderSpinner';
import { useIsMounted } from '@/hooks/useIsMounted';

const IMAGE_UPLOAD_TIMEOUT = 30000; // ms

const validateUpload = (upload: ImageURL) => {
  if (!upload) {
    return false;
  }

  if (typeof upload !== 'object') {
    return false;
  }

  if (typeof upload.location !== 'string') {
    return false;
  }

  if (!upload.upload) {
    return false;
  }

  return true;
};

type ImageUploadRacePromise = (props: {
  imageUploadPromise: Promise<ImageURL>,
  errorMessage: string,
}) => Promise<ImageURL>;

const imageUploadRacePromise: ImageUploadRacePromise = async ({
  imageUploadPromise,
  errorMessage,
}) => {
  const upload = await Promise.race([
    delay(IMAGE_UPLOAD_TIMEOUT),
    imageUploadPromise,
  ]);

  if (!validateUpload(upload)) {
    throw new Error(errorMessage);
  }

  return upload;
};

type FileUploadProps = {
  name: string,
  onImageUpload: OnImageUpload,
};

export function FileUpload({
  name,
  onImageUpload,
}: FileUploadProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const fileRef = useRef<HTMLInputElement>();
  const { setValue, value } = useField<ImageURL>(name);
  const [loading, setLoading] = useState(false);
  const isMounted = useIsMounted();
  const isUploaded = value.locationUpload && value.location === value.locationUpload;

  const onFileUpload = () => {
    if (loading) return;

    if (!fileRef.current) return;

    const { files } = fileRef.current;
    if (!files || !files[0]) return;

    setLoading(true);

    const image = files[0];

    const promise = imageUploadRacePromise({
      imageUploadPromise: onImageUpload(image),
      errorMessage: t('errors.somethingWentWrong'),
    });

    toast.promise(
      promise,
      {
        pending: t('element.imageUpload.pending'),
        success: t('element.imageUpload.success'),
        error: t('errors.somethingWentWrong'),
      },
      {
        draggable: false,
      },
    );

    promise.then((upload: ImageURL) => {
      if (!isMounted.current) return;

      setValue({
        ...upload,
        locationUpload: upload.location,
      });
    });

    promise.finally(() => {
      if (!isMounted.current) return;

      setLoading(false);
    });
  };

  const onClick = () => {
    fileRef.current.click();
  };

  const buttonLabel = () => {
    if (loading) return <LoaderSpinner color={theme.colors.white} />;
    return isUploaded
      ? t('element.imageUpload.change')
      : t('element.imageUpload.upload');
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileRef}
        onChange={onFileUpload}
      />
      <LinkButton disabled={loading} onClick={onClick}>
        {buttonLabel()}
      </LinkButton>
    </>
  );
}
