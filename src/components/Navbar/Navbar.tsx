import React from 'react';
import { useTranslation } from 'react-i18next';

import { useSidebar } from '@/hooks/useSidebarView';
import { useSetSidebarView } from '@/hooks/useSetSidebarView';
import { SidebarView } from '@/components/SidebarProvider';
import { Icon } from '@/components/icons/Icon';
import { usePagePreview } from '@/hooks/usePagePreview';
import { useOnNavbarIconClick } from '@/hooks/useOnNavbarIconClick';
import { assignTestProp } from '@/utils/tests';
import { BreakpointsSelect } from './BreakpointsSelect';
import { HistoryChanges } from './HistoryChanges';
import { PublishButton } from './PublishButton';
import { ButtonIcon } from '../ButtonIcon';
import { useWebBuilderProperties } from '../PropertiesProvider';
import { Options, Wrapper } from './Navbar.styled';

export function Navbar() {
  const { t } = useTranslation();
  const onPageView = usePagePreview();
  const { view } = useSidebar();
  const setSidebarView = useSetSidebarView();
  const onNavbarIconClick = useOnNavbarIconClick();
  const { navbarIcons } = useWebBuilderProperties();

  const onConfigurationView = () => {
    setSidebarView(SidebarView.Configuration);
  };

  const onPageSettingsView = () => {
    setSidebarView(SidebarView.PageSettings);
  };

  const renderNavbarIcons = () => {
    if (!navbarIcons) return null;
    return navbarIcons.map((navbarIcon) => (
      <ButtonIcon
        key={navbarIcon.id}
        id={navbarIcon.id}
        onClick={() => onNavbarIconClick(navbarIcon)}
        tooltip={navbarIcon.tooltip}
      >
        <Icon icon={navbarIcon.icon} />
      </ButtonIcon>
    ));
  };

  return (
    <Wrapper {...assignTestProp('navbar')}>
      <HistoryChanges />
      <BreakpointsSelect />
      <Options>
        <ButtonIcon
          id="pageSettings"
          onClick={onPageSettingsView}
          tooltip={t('page.settings.icon.tooltip')}
          active={view === SidebarView.PageSettings}
        >
          <Icon icon={Icon.PageSettings} />
        </ButtonIcon>
        {renderNavbarIcons()}
      </Options>
      <Options $toLeft>
        <ButtonIcon
          id="configuration"
          onClick={onConfigurationView}
          tooltip={t('configuration.tooltip')}
          active={view === SidebarView.Configuration}
        >
          <Icon icon={Icon.Configuration} />
        </ButtonIcon>
        {
          onPageView && (
            <ButtonIcon
              id="preview"
              onClick={onPageView}
              tooltip={t('preview.tooltip')}
            >
              <Icon icon={Icon.View} />
            </ButtonIcon>
          )
        }
        <PublishButton />
      </Options>
    </Wrapper>
  );
}
