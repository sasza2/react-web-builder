import React, { useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import { useSidebarModalRef } from '../SidebarProvider';
import { Container } from './RenderInSidebarContainer.styled';

type RenderInSidebarModalProps = React.PropsWithChildren<{
  onClose?: () => void,
  closeOnlyOnClickOutsideSidebarModal?: boolean,
  open: boolean,
  opener?: React.MutableRefObject<HTMLElement>,
}>;

export function RenderInSidebarModal({
  children,
  closeOnlyOnClickOutsideSidebarModal,
  onClose,
  open,
  opener,
}: RenderInSidebarModalProps) {
  const sidebarRef = useSidebarModalRef();
  const containerRef = useRef<HTMLDivElement>();
  if (!containerRef.current) {
    containerRef.current = document.createElement('div');
    containerRef.current.style.pointerEvents = 'all';
  }

  useLayoutEffect(() => {
    if (!open || !sidebarRef.current) return;

    sidebarRef.current.appendChild(containerRef.current);

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;

      if (opener?.current && (opener.current === target || opener.current.contains(target))) {
        return;
      }

      if (closeOnlyOnClickOutsideSidebarModal) {
        if (sidebarRef.current.contains(target)) return;
      } else if (containerRef.current.contains(target)) return;

      if (onClose) onClose();
    };

    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      sidebarRef.current.removeChild(containerRef.current);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [closeOnlyOnClickOutsideSidebarModal, open, opener]);

  if (open) {
    return ReactDOM.createPortal(
      <Container>
        {children}
      </Container>,
      containerRef.current,
    );
  }
  return null;
}
