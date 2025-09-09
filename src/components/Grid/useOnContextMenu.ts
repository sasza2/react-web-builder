import { useState } from 'react';
import type { GridProps } from 'react-grid-panzoom';
import type { Position } from 'types';

import { useGridAPI } from '../GridAPIProvider';

type Menu = {
  position: Position,
  elementId?: string | number,
  col: number,
  row: number,
};

export const useOnContextMenu = () => {
  const gridAPI = useGridAPI();
  const [menu, setMenu] = useState<Menu>(null);

  const updateMenu = (nextMenu: Menu) => {
    if (menu) {
      setMenu(null);
      return;
    }

    setMenu(nextMenu);
  };

  const onContainerContextMenu: GridProps['onContainerContextMenu'] = ({
    e,
    x,
    y,
  }) => {
    e.preventDefault();

    const { x: col, y: row } = gridAPI.current.calculateCellPositionByPixels(x, y);

    updateMenu({
      position: { x: e.clientX, y: e.clientY },
      row,
      col,
    });
  };

  const onElementContextMenu: GridProps['onElementContextMenu'] = ({
    e,
    id,
    x,
    y,
  }) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const { x: col, y: row } = gridAPI.current.calculateCellPositionByPixels(x, y);

    updateMenu({
      position: { x: e.clientX, y: e.clientY },
      elementId: id,
      row,
      col,
    });
  };

  const onClose = () => {
    setMenu(null);
  };

  return {
    onContainerContextMenu,
    onClose,
    onElementContextMenu,
    menu,
  };
};
