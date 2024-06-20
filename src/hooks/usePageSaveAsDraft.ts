import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { useWebBuilderProperties } from '@/components/PropertiesProvider';
import { useChangesSetIsSaved } from './useChangesSetIsSaved';
import { useBuildPage } from './page/useBuildPage';

export const usePageSaveAsDraft = () => {
  const build = useBuildPage();
  const { onSaveAsDraft } = useWebBuilderProperties();
  const setIsSaved = useChangesSetIsSaved();
  const { t } = useTranslation();

  const save = async () => {
    if (!onSaveAsDraft) return;

    const page = build();
    const promise = onSaveAsDraft(page);

    toast.promise(
      promise,
      {
        pending: t('publish.draft.pending'),
        success: t('publish.draft.success'),
        error: t('errors.somethingWentWrong'),
      },
      {
        draggable: false,
      },
    );

    await promise;

    setIsSaved();
  };

  return save;
};
