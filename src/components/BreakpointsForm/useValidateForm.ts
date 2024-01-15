import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Breakpoint, WebBuilderElements } from 'types';
import { NAVBAR_HEIGHT } from '@/consts';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useElements } from '@/hooks/useElements';
import { useSidebarRef } from '@/components/SidebarProvider';
import { Errors, IForm } from './types';

type UseValidateForm = () => [Errors, (form: IForm) => Errors];

const validateIsNumber = (value: string | number) => !Number.isNaN(Number.parseInt(value as string));

const validateIsGt = (value: string | number, min: number) => (value as unknown as number) >= min;

const validateIsLt = (value: string, max: number) => (value as unknown as number) < max;

const validateHorizontalPadding = (paddingLeft: number, paddingRight: number, width: number) => width - paddingLeft - paddingRight >= 320;

const validateIfBreakpointExists = (
  value: string,
  currentBreakpoint: Breakpoint | null,
  breakpoints: Breakpoint[],
) => {
  const valueAsNum = parseInt(value);
  return breakpoints.some((breakpoint) => {
    if (currentBreakpoint && breakpoint.id === currentBreakpoint.id) return false;
    return valueAsNum === breakpoint.from;
  });
};

const validateIfColumnsFitElements = (cols: number, elements: WebBuilderElements) => elements.filter((element) => element.x + element.w > cols).length === 0;

export const useValidateForm: UseValidateForm = () => {
  const { t } = useTranslation();
  const breakpoint = useBreakpoint();
  const breakpoints = useBreakpoints();
  const { elements } = useElements();
  const sidebarRef = useSidebarRef();
  const [errors, setErrors] = useState<Errors>([]);

  const validate = (form: IForm) => {
    const nextErrors = [];

    if (!validateIsNumber(form.from)) {
      nextErrors.push({
        name: 'from',
        error: t('breakpoint.errors.notNumber'),
      });
    }

    if (!validateIsGt(form.from, 360)) {
      nextErrors.push({
        name: 'from',
        error: t('breakpoint.errors.lowerThanMinimum', { value: 360 }),
      });
    }

    if (validateIfBreakpointExists(form.from, breakpoint, breakpoints)) {
      nextErrors.push({
        name: 'from',
        error: t('breakpoint.errors.alreadyExists'),
      });
    }

    if (!validateIsNumber(form.rowHeight)) {
      nextErrors.push({
        name: 'rowHeight',
        error: t('breakpoint.errors.notNumber'),
      });
    }

    if (!validateIsGt(form.rowHeight, 5)) {
      nextErrors.push({
        name: 'rowHeight',
        error: t('breakpoint.errors.lowerThanMinimum', { value: 5 }),
      });
    }

    if (!validateIsNumber(form.cols)) {
      nextErrors.push({
        name: 'cols',
        error: t('breakpoint.errors.notNumber'),
      });
    }

    if (!validateIsGt(form.cols, 0)) {
      nextErrors.push({
        name: 'cols',
        error: t('breakpoint.errors.notGreaterThan'),
      });
    }

    if (!validateIfColumnsFitElements(parseInt(form.cols) || 0, elements)) {
      nextErrors.push({
        name: 'cols',
        error: t('breakpoint.errors.wontFitGrid'),
      });
    }

    if (!validateIsLt(form.cols, parseInt(form.from) || 0)) {
      nextErrors.push({
        name: 'cols',
        error: t('breakpoint.errors.biggerThanFrom'),
      });
    }

    if (!validateIsNumber(form.padding.top)) {
      nextErrors.push({
        name: 'paddingTop',
        error: t('breakpoint.errors.notNumber'),
      });
    }

    if (!validateIsGt(form.padding.top, 0)) {
      nextErrors.push({
        name: 'paddingTop',
        error: 'Value is not greater or equal 0',
      });
    }

    if (!validateIsNumber(form.padding.right)) {
      nextErrors.push({
        name: 'paddingRight',
        error: t('breakpoint.errors.notNumber'),
      });
    }

    if (!validateIsGt(form.padding.right, 0)) {
      nextErrors.push({
        name: 'paddingRight',
        error: t('breakpoint.errors.notGreaterOrEqualZero'),
      });
    }

    if (!validateIsNumber(form.padding.left)) {
      nextErrors.push({
        name: 'paddingLeft',
        error: t('breakpoint.errors.notNumber'),
      });
    }

    if (!validateIsGt(form.padding.left, 0)) {
      nextErrors.push({
        name: 'paddingLeft',
        error: t('breakpoint.errors.notGreaterOrEqualZero'),
      });
    }

    if (!validateHorizontalPadding(
      parseInt(`${form.padding.left}`) || 0,
      parseInt(`${form.padding.right}`) || 0,
      parseInt(form.from) || 0,
    )) {
      nextErrors.push({
        name: 'paddingLeft',
        error: t('breakpoint.errors.horizontalPaddingTooBig', { value: 320 }),
      });
      nextErrors.push({
        name: 'paddingRight',
        error: t('breakpoint.errors.horizontalPaddingTooBig', { value: 320 }),
      });
    }

    if (nextErrors.length) {
      setTimeout(() => {
        const errorNodes = sidebarRef.current.querySelectorAll('[data-builder-error="true"]');
        if (!errorNodes.length) return;

        const firstError = errorNodes[0];

        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const errorRect = firstError.getBoundingClientRect();

        sidebarRef.current.scrollTo({
          top: errorRect.top - (sidebarRect.top - sidebarRef.current.scrollTop) - NAVBAR_HEIGHT, // TODO
          behavior: 'smooth',
        });
      }, 100); // TODO
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  return [errors, validate];
};
