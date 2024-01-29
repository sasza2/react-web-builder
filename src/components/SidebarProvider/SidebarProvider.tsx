import { AccordionState, useAccordion } from '@/hooks/useAccordion';
import React, {
  createContext, PropsWithChildren, useContext, useMemo, useRef,
} from 'react';

export enum SidebarView {
  AddElement = 1,
  AddBreakpoint = 2,
  EditBreakpoint = 3,
  EditElement = 4,
  Configuration = 5,
  Theme = 6,
  PageSettings = 7,
}

type SidebarContext = {
  modalRef: React.MutableRefObject<HTMLDivElement>;
  sidebarRef: React.MutableRefObject<HTMLDivElement>;
  selectNewElementAccordion: AccordionState,
};

const Sidebar = createContext<SidebarContext>({} as SidebarContext);

export const useSelectNewElementAccordion = (): AccordionState => {
  const { selectNewElementAccordion } = useContext(Sidebar);
  return selectNewElementAccordion;
};

export const useSidebarRef = (): React.MutableRefObject<HTMLDivElement> => {
  const { sidebarRef } = useContext(Sidebar);
  return sidebarRef;
};

export const useSidebarModalRef = (): React.MutableRefObject<HTMLDivElement> => {
  const { modalRef } = useContext(Sidebar);
  return modalRef;
};

export function SidebarProvider({ children }: PropsWithChildren) {
  const modalRef = useRef<HTMLDivElement>();
  const sidebarRef = useRef<HTMLDivElement>();
  const selectNewElementAccordion = useAccordion();

  const value = useMemo(() => ({
    selectNewElementAccordion,
    modalRef,
    sidebarRef,
  }), [selectNewElementAccordion, sidebarRef]);

  return (
    <Sidebar.Provider value={value}>
      {children}
    </Sidebar.Provider>
  );
}
