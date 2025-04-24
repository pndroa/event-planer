'use client'

import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './errorFallback'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function ErrorBoundaryWrapper({ children }: Props) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
