import { Component, Fragment, type ReactNode } from 'react';
import { Button, Panel } from '../../components/ui';

interface Props {
  children: ReactNode;
  scope?: 'app' | 'header' | 'page' | 'section';
}

export class RecoveryBoundary extends Component<Props, { failed: boolean; attempt: number }> {
  state = { failed: false, attempt: 0 };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    const { scope = 'section', children } = this.props;
    if (!this.state.failed) return <Fragment key={this.state.attempt}>{children}</Fragment>;

    return (
      <Panel className="motion-still" role="region" aria-label="Display error">
        <p role="alert" className="mb-3 text-dim">
          {scope === 'app' ? 'IGNIS could not display this page.'
            : scope === 'header' ? 'Navigation could not be displayed. The page is still available.'
              : scope === 'page' ? 'This page failed to display. You can still use navigation.'
                : 'This section failed to display. The other sections are still available.'}
        </p>
        <Button onClick={() => this.setState(({ attempt }) => ({ failed: false, attempt: attempt + 1 }))}>Retry</Button>
      </Panel>
    );
  }
}
