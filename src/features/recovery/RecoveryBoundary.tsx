import { Component, Fragment, type ReactNode } from 'react';
import { Button, Panel } from '../../components/ui';
import { format, t } from '../../i18n';

interface Props {
  children: ReactNode;
  scope?: 'app' | 'header' | 'page' | 'section';
  /** Section name for the message ("Evidence map failed to display…"); generic wording without it. */
  label?: string;
}

export class RecoveryBoundary extends Component<Props, { failed: boolean; attempt: number }> {
  state = { failed: false, attempt: 0 };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    const { scope = 'section', label, children } = this.props;
    if (!this.state.failed) return <Fragment key={this.state.attempt}>{children}</Fragment>;

    return (
      <Panel className="motion-still" role="region" aria-label={t('recoveryRegion')}>
        <p role="alert" className="mb-3 text-dim">
          {scope === 'app' ? t('recoveryApp')
            : scope === 'header' ? t('recoveryHeader')
              : scope === 'page' ? t('recoveryPage')
                : label ? format('recoveryNamedSection', { section: label }) : t('recoverySection')}
        </p>
        <Button onClick={() => this.setState(({ attempt }) => ({ failed: false, attempt: attempt + 1 }))}>{t('retry')}</Button>
      </Panel>
    );
  }
}
