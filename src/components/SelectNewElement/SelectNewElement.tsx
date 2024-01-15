import React, {
  memo, useCallback, useMemo, useState,
} from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { WebBuilderComponent, WebBuilderGroup } from 'types';
import { assignTestProp } from '@/utils/tests';
import { DragElement, DragElementDetails } from '@/components/DragElement';
import { useGridPositionTop } from '@/hooks/useGridPositionTop';
import { SidebarHeader } from '../SidebarHeader';
import { Icon } from '../icons/Icon';
import { SidebarScrollbar } from '../SidebarScrollbar';
import { PickComponent } from './PickComponent';
import { Container, Grid, GridItem } from './SelectNewElement.styled';

const componentName = 'SelectNewElement';

const getGroupsFromComponent = (
  component: WebBuilderComponent,
  t: TFunction,
): WebBuilderGroup[] => {
  const defaultGroup: WebBuilderGroup = {
    id: 'other',
    label: t('group.other'),
  };

  if (!component.group) return [defaultGroup];

  if (Array.isArray(component.group)) {
    if (!component.group.length) return [defaultGroup];
    return component.group;
  }

  return [component.group];
};

const sortComponents = (components: WebBuilderComponent[]): WebBuilderComponent[] => [...components].sort((a, b) => (a.order || 0) - (b.order || 0));

type GroupWithComponents = { components: WebBuilderComponent[], group: WebBuilderGroup };

const sortGroups = <T extends GroupWithComponents[] >(groups: T): T => {
  const comparator = (a: { group: WebBuilderGroup }, b: { group: WebBuilderGroup }) => (a.group.order || 0) - (b.group.order || 0);
  groups.forEach((item) => {
    item.components = sortComponents(item.components);
  });
  return [...groups].sort(comparator) as T;
};

type SelectNewElementProps = {
  components: Array<WebBuilderComponent>,
};

function SelectNewElementIn({
  components,
}: SelectNewElementProps) {
  const { t } = useTranslation();
  const [dragElement, setDragElement] = useState<DragElementDetails>(null);
  const gridTop = useGridPositionTop();

  const groups = useMemo(() => sortGroups(Object.values(components.reduce((map, component) => {
    getGroupsFromComponent(component, t).forEach((group) => {
      const groupById = map[group.id];
      if (!groupById) {
        map[group.id] = { group, components: [component] };
      } else {
        groupById.components.push(component);
      }
    });

    return map;
  }, {} as Record<string, GroupWithComponents>))), [components]);

  const onDragCancel = useCallback(() => {
    setDragElement(null);
  }, []);

  const onDragSuccess = onDragCancel;

  const onDesktopClick = (component: WebBuilderComponent): React.MouseEventHandler => (e) => {
    if (e.button) return;

    const target = (e.target as HTMLDivElement).closest('[data-id="component"]');
    if (!target) return;

    const componentRect = target.getBoundingClientRect();

    setDragElement({
      component,
      offset: {
        x: e.clientX - componentRect.x,
        y: e.clientY - componentRect.y + gridTop,
      },
      position: {
        x: componentRect.x,
        y: componentRect.y - gridTop,
      },
      width: componentRect.width,
    });
  };

  const createKeyForComponent = (component: WebBuilderComponent, index: number) => {
    let key = `${component.id}-${index}`;
    component.props.forEach((prop) => {
      key += `-${prop.id}-${prop.type}`;
    });

    return key;
  };

  return (
    <>
      { dragElement && (
        <DragElement
          component={dragElement.component}
          position={dragElement.position}
          offset={dragElement.offset}
          width={dragElement.width}
          onCancel={onDragCancel}
          onSuccess={onDragSuccess}
        >
          <PickComponent active component={dragElement.component} />
        </DragElement>
      ) }
      <Container {...assignTestProp(componentName)}>
        <SidebarHeader {...assignTestProp(componentName, 'header')}>
          {t('selectNewElement.title')}
        </SidebarHeader>
        <SidebarScrollbar>
          <Accordion allowMultipleExpanded allowZeroExpanded>
            {groups.map((groupWithComponents) => (
              <AccordionItem key={groupWithComponents.group.id}>
                <AccordionItemHeading>
                  <AccordionItemButton
                    data-id="accordionItemButton"
                    {...assignTestProp(componentName, 'group', groupWithComponents.group.id)}
                  >
                    {groupWithComponents.group.label}
                    <Icon icon={Icon.ArrowLeft} />
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <Grid {...assignTestProp(componentName, 'components')}>
                    {groupWithComponents.components.map((component, index) => (
                      <GridItem
                        key={createKeyForComponent(component, index)}
                        {...assignTestProp(componentName, 'component', component.id)}
                      >
                        <PickComponent
                          component={component}
                          onClick={onDesktopClick(component)}
                        />
                      </GridItem>
                    ))}
                  </Grid>
                </AccordionItemPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </SidebarScrollbar>
      </Container>
    </>
  );
}

export const SelectNewElement = memo(SelectNewElementIn);

SelectNewElement.displayName = componentName;
