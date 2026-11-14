import { Component, type ReactNode } from 'react';
import { Button, Panel } from './ui';

export class RecoveryBoundary extends Component<{ children: ReactNode; label: string }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <Panel>
      <p role="alert">{this.props.label} failed to load.</p>
      <Button size="sm" className="mt-3" onClick={() => this.setState({ failed: false })}>Retry</Button>
    </Panel>;
  }
}
