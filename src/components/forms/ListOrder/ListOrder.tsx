import React, { useCallback, useMemo, useState } from 'react';
import ReactGrid, { GridElement } from 'react-grid-panzoom';

import { useField } from '@/components/FormProvider';
import { IFormControl } from '../types';
import { Component, ComponentItem, ROW_HEIGHT } from './Component';

type GridElementWithItem = GridElement & { item: ComponentItem };

type ListOrderProps = {
  options: Array<ComponentItem>,
} & IFormControl;

export function ListOrder({
  name,
  options,
}: ListOrderProps) {
  const [width, setWidth] = useState(0);
  const { setValue, value } = useField<Array<ComponentItem>>(name);

  const onInit = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    const { width: currentWidth } = node.getBoundingClientRect();
    setWidth(currentWidth);
  }, []);

  const elements = useMemo(() => {
    if (!Array.isArray(options)) return [];

    let combinedOptions: Array<ComponentItem> = [];
    if (Array.isArray(value)) {
      value.forEach((option) => {
        combinedOptions.push(option);
      });
    }

    if (Array.isArray(options)) {
      options.forEach((item) => {
        const indexOption = combinedOptions.findIndex((option) => option.id === item.id);
        if (indexOption >= 0) {
          combinedOptions[indexOption] = {
            ...item,
            ...combinedOptions[indexOption],
          };
        } else {
          combinedOptions = combinedOptions.filter((option) => option.id !== item.id);
        }
      });

      options.forEach((item) => {
        const indexOption = combinedOptions.findIndex((option) => option.id === item.id);
        if (indexOption < 0) {
          combinedOptions.push(item);
        }
      });
    }

    return combinedOptions.map((item, index) => ({
      id: item.id,
      h: 1,
      render: (props: GridElementWithItem) => <Component {...props.item} />,
      w: 1,
      x: 0,
      y: index,
      item,
      resizable: false,
    }));
  }, [options, value]);

  const setElements = (nextElements: GridElementWithItem[]) => {
    const sortedElementsByY = [...nextElements].sort((a, b) => a.y - b.y);
    setValue(sortedElementsByY.map((element) => element.item));
  };

  return (
    <div ref={onInit}>
      { width > 0 && (
        <ReactGrid
          boundary
          cols={1}
          rowHeight={ROW_HEIGHT}
          gapVertical={5}
          rows={options.length}
          elements={elements}
          setElements={setElements}
          width={width}
          disabledZoom
        />
      ) }
    </div>
  );
}
