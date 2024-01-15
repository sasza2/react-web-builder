import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { assignTestProp } from '@/utils/tests';
import { Select } from '@/components/forms/Select';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useSelectBreakpoint } from '@/hooks/useSelectBreakpoint';
import { SidebarView } from '@/components/SidebarProvider';
import { useSetSidebarView } from '@/hooks/useSetSidebarView';
import { useSidebar } from '@/hooks/useSidebarView';
import { FieldProvider } from '@/components/FormProvider';
import { Container } from './BreakpointSelect.styled';
import { BreakpointLabel } from './BreakpointLabel';

export function BreakpointsSelect() {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const setSelectedBreakpoint = useSelectBreakpoint();
  const breakpoints = useBreakpoints();
  const setSidebarView = useSetSidebarView();
  const sidebar = useSidebar();
  const blockChangeRef = useRef<boolean>(null);

  const options = useMemo(() => {
    const sortedBreakpoints = [...breakpoints].sort((a, b) => a.from - b.from);

    const list = sortedBreakpoints.map((itemBreakpoint, index) => {
      const next = sortedBreakpoints[index + 1];
      let label = '';
      if (next) {
        if (itemBreakpoint.to === null) label = `${itemBreakpoint.from}px - ${next.from}px`;
        else label = `${itemBreakpoint.from}px - ${itemBreakpoint.to}px`;
      } else if (itemBreakpoint.to === null) label = `${itemBreakpoint.from}px - 100%`;
      else label = `${itemBreakpoint.from}px - ${itemBreakpoint.to}px`;

      return {
        value: itemBreakpoint.id,
        label: (
          <BreakpointLabel
            testId={`breakpoint${itemBreakpoint.from}`}
            label={label}
            width={itemBreakpoint.from}
          />
        ),
      };
    });

    list.reverse();

    list.push({
      value: '-',
      label: (
        <BreakpointLabel
          testId="breakpointAdd"
          label={t('breakpoint.add')}
        />
      ),
    });

    return list;
  }, [breakpoints, t]);

  const onClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (blockChangeRef.current) return;

    if (breakpoint && breakpoint.id) {
      setSidebarView(SidebarView.EditBreakpoint);
    } else {
      setSidebarView(SidebarView.AddBreakpoint);
    }
  };

  const setValue = (breakpointId: string) => {
    if (breakpointId === breakpoint?.id) return;
    if (blockChangeRef.current) return;

    blockChangeRef.current = true;

    setSelectedBreakpoint(breakpointId);

    const nextSidebarView = breakpointId === '-'
      ? SidebarView.AddBreakpoint
      : SidebarView.EditBreakpoint;

    if (sidebar.view !== nextSidebarView) {
      setSidebarView(nextSidebarView);
    }

    setTimeout(() => {
      blockChangeRef.current = false;
    }, 600);
  };

  return (
    <Container
      data-id="breakpointsSelect"
      onClick={onClick}
      {...assignTestProp('breakpointSelect')}
    >
      <FieldProvider
        name="breakpoint"
        setValue={setValue}
        value={breakpoint ? breakpoint.id : '-'}
      >
        <Select
          name="breakpoint"
          size="lg"
          menuTooltip={t('breakpoint.tooltip')}
          options={options}
        />
      </FieldProvider>
    </Container>
  );
}
