import { useMemo, useState } from 'react';

type AccordionID = string | number;

export type AccordionState = {
  preExpanded: AccordionID[],
  onChange: React.Dispatch<React.SetStateAction<AccordionID[]>>,
};

export const useAccordion = (): AccordionState => {
  const [preExpanded, onChange] = useState<AccordionID[]>([]);

  const accordion = useMemo(() => ({
    preExpanded,
    onChange,
  }), [preExpanded, onChange]);

  return accordion;
};
