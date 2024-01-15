import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import ReactDOM from 'react-dom';

import { Position } from 'types';
import { useWebBuilderSize } from '@/components/WebBuilderSize';
import { Popup as PopupContainer } from '@/components/Navbar/PublishButton/PublishButton.styled';
import { hasClipboard } from '@/utils/clipboard';
import { Container, WIDTH } from './Popup.styled';
import { RemoveElement } from './RemoveElement';
import { CopyElement } from './CopyElement';
import { CopyAllElements } from './CopyAllElements';
import { Paste } from './Paste';
import { RemoveEmptySpaceBelow } from './RemoveEmptySpaceBelow';
import { SelectElement } from './SelectElement';
import { SelectMultipleElements } from './SelectMultipleElements';

type PopupProps = {
  gridPaste: (x: number, y: number) => void,
  onClose: () => void,
  menu: {
    col: number,
    elementId?: string | number,
    row: number,
    position: Position,
  },
};

export function Popup({ gridPaste, onClose, menu }: PopupProps) {
  const [height, setHeight] = useState(0);
  const [closing, setClosing] = useState(false);
  const size = useWebBuilderSize();
  const nodeRef = useRef<HTMLDivElement>();

  const maxLeft = size.width - WIDTH - 10;
  const left = Math.min(menu.position.x, maxLeft);

  const maxTop = size.height - height - 10;
  const top = Math.min(menu.position.y, maxTop);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const onClick = (e: MouseEvent) => {
      const { target } = e;
      if (!target) return;

      if (nodeRef.current.contains(target as HTMLDivElement)) return;

      setClosing(true);

      clearTimeout(timer);
      timer = setTimeout(onClose, 300);
    };

    window.addEventListener('click', onClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', onClick);
    };
  }, []);

  const onInit = useCallback((node: HTMLDivElement) => {
    if (!node) return;

    nodeRef.current = node;

    const { height: currentHeight } = node.getBoundingClientRect();
    setHeight(currentHeight);
  }, []);

  const options = () => {
    const list: JSX.Element[] = [];

    if (menu.elementId) {
      list.push(
        <SelectElement key="select" elementId={menu.elementId} onClose={onClose} />,
        <CopyElement key="copy" elementId={menu.elementId} onClose={onClose} />,
        <RemoveElement key="remove" elementId={menu.elementId} onClose={onClose} />,
      );
    } else {
      list.push(
        <SelectMultipleElements
          key="select-multiple-elements"
          {...menu}
          onClose={onClose}
        />,
      );
      list.push(
        <RemoveEmptySpaceBelow
          key="remove-empty-space-below"
          {...menu}
          onClose={onClose}
        />,
      );
      list.push(
        <CopyAllElements key="copy-all" onClose={onClose} />,
      );

      if (hasClipboard()) {
        list.push(
          <Paste
            key="paste"
            gridPaste={gridPaste}
            {...menu}
            onClose={onClose}
          />,
        );
      }
    }

    return list;
  };

  return ReactDOM.createPortal(
    <Container $left={left} $top={top} ref={onInit}>
      <PopupContainer $isOpen $isClosing={closing}>
        {options()}
      </PopupContainer>
    </Container>,
    document.body,
  );
}
