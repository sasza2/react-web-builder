import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
// eslint-disable-next-line
// @ts-ignore
import arrowCreate from 'arrows-svg';

import { HelperArrowItem } from 'types';
import { ConfirmButton } from '@/components/Button';
import { assignTestProp } from '@/utils/tests';
import shadows from './shadows';
import { ButtonContainer, Title } from './HelperArrow.styled';

type HelperArrowProps = {
  onClose?: () => void,
} & HelperArrowItem;

const componentName = 'HelperArrow';

export function HelperArrow({
  hasButton = true,
  selector,
  onClose,
  title,
}: HelperArrowProps) {
  const { t } = useTranslation();
  const titleRef = useRef<HTMLDivElement>();
  const [animating, setAnimating] = useState(true);
  const [nodeExists, setNodeExists] = useState<boolean>(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  const onHide = useCallback(() => {
    shadows.removeWithTimeout();
    setNodeExists(false);
    setAnimating(true);
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => shadows.removeImmediately, []);

  useEffect(() => {
    if (!nodeExists || animating) return;

    let arrow: { node: HTMLDivElement, clear: () => void } = null;

    const createArrowInterval = setInterval(() => {
      try {
        arrow = arrowCreate({ // eslint-disable-line
          from: () => titleRef.current,
          to: () => document.querySelector(selector),
        });

        document.body.appendChild(arrow.node);

        clearInterval(createArrowInterval);
      } catch (e) {
        arrow = null;
      }
    }, 200);

    const start = new Date().getTime();

    const onClick = (e: MouseEvent) => {
      const now = new Date().getTime() - start;
      if (now < 1000) return;

      const target = e.target as HTMLDivElement;
      if (target.getAttribute('data-id') === 'hide-hint') return;

      onHide();
    };

    window.addEventListener('mousedown', onClick);

    return () => {
      clearInterval(createArrowInterval);
      if (arrow) arrow.clear();
      window.removeEventListener('mousedown', onClick);
    };
  }, [nodeExists, animating]);

  useEffect(() => {
    if (!nodeExists) return;

    const stopAnimating = () => {
      setAnimating(false);
      shadows.stopAnimating();
    };

    const timer = setTimeout(stopAnimating, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [nodeExists]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const name = `hint-${selector}`;
    localStorage.setItem(name, 'true');

    document.body.style.overflow = 'hidden';

    let timer: ReturnType<typeof setTimeout>;

    let retries = 0;
    const maxRetries = 15;

    const loadNode = () => {
      nodeRef.current = document.querySelector(selector);

      retries++;
      if (maxRetries < retries) {
        onHide();
        return;
      }
      if (!nodeRef.current) return;

      shadows.init(nodeRef.current);
      shadows.startAnimating();
      setNodeExists(true);
      setAnimating(true);
      clearInterval(timer);
    };

    timer = setInterval(loadNode, 200);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = null;
    };
  }, [selector]);

  if (!nodeExists) return null;
  return ReactDOM.createPortal(
    <Title
      {...assignTestProp(componentName)}
      $animating={animating}
    >
      <p
        {...assignTestProp(componentName, 'title')}
        ref={titleRef}
      >
        {title}
      </p>
      { hasButton && (
        <ButtonContainer {...assignTestProp(componentName, 'button')}>
          <ConfirmButton id="hide-hint" onClick={onHide}>
            {t('hints.confirm')}
          </ConfirmButton>
        </ButtonContainer>
      ) }
    </Title>,
    document.body,
  );
}

HelperArrow.displayName = HelperArrow;
