export const blurInput = () => {
  if ('blur' in document.activeElement && typeof document.activeElement.blur === 'function') {
    document.activeElement.blur();
  }
};

export const hasFocusOnInput = () => {
  if (document.activeElement === document.body) return false;

  const isLastClickedIsInput = (document.activeElement as HTMLElement).tagName === 'INPUT';
  return isLastClickedIsInput;
};
