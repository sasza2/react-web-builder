export enum TransformErrorTypes {
  InvalidCSS = 'invalidCSS',
  UnsupportedHTMLAttribute = 'UnsupportedHTMLAttribute',
  UnsupportedHTMLAttributeValue = 'UnsupportedHTMLAttributeValue',
  UnsupportedHTMLTagName = 'UnsupportedHTMLTagName',
  UnsupportedCSS = 'UnsupportedCSS',
  UnsupportedCSSAttribute = 'UnsupportedCSSAttribute',
  UnsupportedCSSSelector = 'UnsupportedCSSSelector',
  UnsupportedCSSValue = 'UnsupportedCSSValue',
}

export type TransformError = {
  type: TransformErrorTypes.UnsupportedHTMLAttribute,
  attribute: string,
  tagName: string,
} | {
  type: TransformErrorTypes.UnsupportedCSSValue,
  prop: string,
  value: string,
} | {
  type: TransformErrorTypes.UnsupportedCSSAttribute,
  prop: string,
} | {
  type: TransformErrorTypes.UnsupportedHTMLAttributeValue,
  attribute: string,
  tagName: string,
  value: string,
} | {
  type: TransformErrorTypes.UnsupportedCSSSelector,
  selector: string,
} | {
  type: TransformErrorTypes.UnsupportedCSS,
  css: string,
} | {
  type: TransformErrorTypes.UnsupportedHTMLTagName,
  tagName: string,
} | {
  type: TransformErrorTypes.InvalidCSS,
  css: string,
};

type WrappedError = {
  error: TransformError,
  uniqueCode: () => string,
};

export const wrapError = (error: TransformError): WrappedError => {
  const uniqueCode = (): string => JSON.stringify(error);

  return {
    error,
    uniqueCode,
  };
};

export type ErrorsInstance = {
  add: (wrappedError: WrappedError) => void,
  errors: TransformError[],
};

export const initErrorsInstance = (): ErrorsInstance => {
  const errorsUniqueCodes = new Set<string>();
  const errors: TransformError[] = [];

  const has = (wrappedError: WrappedError) => errorsUniqueCodes.has(wrappedError.uniqueCode());

  const add = (wrappedError: WrappedError) => {
    if (!has(wrappedError)) {
      errorsUniqueCodes.add(wrappedError.uniqueCode());
      errors.push(wrappedError.error);
    }
  };

  return {
    add,
    errors,
  };
};

export const reportError = (errors: ErrorsInstance | undefined, wrappedError: WrappedError) => {
  if (errors) {
    errors.add(wrappedError);
  }
};
