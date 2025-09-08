import { ParseKeys } from 'i18next';
import { useTranslation } from 'react-i18next';

type TransProps = {
  i18nKey: ParseKeys,
  components?: Record<string, React.ReactNode>,
};

export const Trans: React.FC<TransProps> = ({ i18nKey, components }) => {
  const { t } = useTranslation();
  return t(i18nKey, { components });
};
