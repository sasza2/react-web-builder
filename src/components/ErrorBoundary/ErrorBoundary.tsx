import type { TFunction } from 'i18next';
import React, { type ReactNode } from 'react';
import { withTranslation } from 'react-i18next';

interface Props {
  children?: ReactNode;
  t: TFunction,
}

interface State {
  hasError: boolean;
}

class ErrorBoundaryIn extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <>{this.props.t('errors.somethingWentWrong')}</>;
    }
    return this.props.children;
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryIn);
