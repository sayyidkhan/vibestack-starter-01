import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught error', { error, info })
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="card state error">
          <h3>Unexpected error</h3>
          <p>Refresh the page and try again.</p>
        </section>
      )
    }

    return this.props.children
  }
}
