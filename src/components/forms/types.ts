export type FormError = {
  name: string,
  error: string,
};

export type FormErrors = FormError[];

export type IFormControl = {
  errors?: FormErrors,
  name?: string,
  label?: JSX.Element | string,
  description?: string,
  testId?: string,
};
