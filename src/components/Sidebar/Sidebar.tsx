import React from 'react';

import { assignTestProp } from '@/utils/tests';
import { useWebBuilderSizeHeight } from '@/components/WebBuilderSize';
import { useAppSelector } from '@/store/useAppSelector';
import { AddBreakpoint, EditBreakpoint } from '@/components/BreakpointsForm';
import { Configuration } from '@/components/Configuration';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { PageSettings } from '../PageSettings';
import { EditProperties } from '../EditProperties';
import { ErrorBoundary } from '../ErrorBoundary';
import { SelectNewElement } from '../SelectNewElement';
import { SidebarView, useSidebarRef } from '../SidebarProvider/SidebarProvider';
import { Container } from './Sidebar.styled';
import { Modal } from './Modal';
import { useComponentsProperty } from '../ComponentsProvider';

export function Sidebar() {
  const components = useComponentsProperty();
  const sidebar = useAppSelector((state) => state.sidebar);
  const sidebarRef = useSidebarRef();
  const height = useWebBuilderSizeHeight();
  const breakpoints = useBreakpoints();

  const renderContent = () => {
    switch (sidebar.view) {
      case SidebarView.AddBreakpoint:
        return <AddBreakpoint />;
      case SidebarView.EditBreakpoint:
        return <EditBreakpoint />;
      case SidebarView.EditElement:
        return <EditProperties components={components} />;
      case SidebarView.Configuration:
        return <Configuration />;
      case SidebarView.PageSettings:
        return <PageSettings />;
      default:
        if (!breakpoints.length) return <AddBreakpoint />;
        return <SelectNewElement components={components} />;
    }
  };

  return (
    <>
      <Container
        className="web-builder-sidebar"
        $height={height}
        ref={sidebarRef}
        {...assignTestProp('sidebar')}
      >
        <ErrorBoundary key={sidebar.view}>
          {renderContent()}
        </ErrorBoundary>
      </Container>
      <Modal />
    </>
  );
}
