import type { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { HTMLComponentValue } from 'types';

import { useField } from '@/components/FormProvider';
import { useHTMLTransform } from '@/hooks/useHTMLTransform';
import { type TransformError, TransformErrorTypes } from '@/utils/html2json/errors';

import { FormControl } from '../FormControl';
import { InputGroup } from '../Input/Input.styled';
import type { FormErrors, IFormControl } from '../types';

const CSS_MAX_LENGTH = 100; // chars

type InputHTMLProps = {
  disabled?: boolean,
} & IFormControl;

const transformError = (t: TFunction<'common'>) => (error: TransformError): string => {
  switch (error.type) {
    case TransformErrorTypes.InvalidCSS:
      return t('element.html.errors.invalidCSS', { css: error.css.substring(0, CSS_MAX_LENGTH) });
    case TransformErrorTypes.UnsupportedCSS:
      return t('element.html.errors.unsupportedCSS', { css: error.css.substring(0, CSS_MAX_LENGTH) });
    case TransformErrorTypes.UnsupportedCSSAttribute:
      return t('element.html.errors.unsupportedCSSAttribute', { prop: error.prop });
    case TransformErrorTypes.UnsupportedCSSSelector:
      return t('element.html.errors.unsupportedCSSSelector', { selector: error.selector });
    case TransformErrorTypes.UnsupportedCSSValue:
      return t('element.html.errors.unsupportedCSSValue', { prop: error.prop, value: error.value });
    case TransformErrorTypes.UnsupportedHTMLAttribute:
      return t('element.html.errors.unsupportedHTMLAttribute', error);
    case TransformErrorTypes.UnsupportedHTMLAttributeValue:
      return t('element.html.errors.unsupportedHTMLAttributeValue', error);
    case TransformErrorTypes.UnsupportedHTMLTagName:
      return t('element.html.errors.unsupportedHTMLTagName', { tagName: error.tagName });
    default:
      return null;
  }
};

export function InputHTML({
  disabled,
  name,
  label,
}: InputHTMLProps) {
  const [hasFocus, setFocus] = useState(false);
  const { setValue, value: html } = useField<HTMLComponentValue>(name);
  const [, errors] = useHTMLTransform(html.value);
  const { t } = useTranslation();

  const onFocusInternal = () => {
    setFocus(true);
  };

  const onBlurInternal: React.FocusEventHandler<HTMLTextAreaElement> = (e) => {
    setValue({ value: e.target.value });
    setFocus(false);
  };

  const getCombinedErrors = (): FormErrors => {
    if (!errors) return null;

    const errorsStr: Array<string | null> = errors.errors.map(transformError(t));

    return errorsStr.filter(Boolean).map((error) => ({ name, error }));
  };

  return (
    <FormControl name={name} errors={getCombinedErrors()} label={label}>
      <InputGroup $hasFocus={hasFocus} $height={400}>
        <textarea
          disabled={disabled}
          onFocus={onFocusInternal}
          onBlur={onBlurInternal}
          onChange={(e) => setValue({ value: e.target.value })}
          style={{ overflow: 'scroll' }}
          value={html.value}
        />
      </InputGroup>
    </FormControl>
  );
}
