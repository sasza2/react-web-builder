export type FormError = {
  name: string,
  error: string,
};

export type FormErrors = FormError[];

export type IFormControl = {
  errors?: FormErrors,
  name?: string,
  label?: JSX.Element | string,
  description?: JSX.Element | string,
  testId?: string,
};
