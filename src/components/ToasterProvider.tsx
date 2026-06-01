'use client'

import { Toaster } from 'react-hot-toast'

export default function ToasterProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 5000,
        style: {
          background: 'var(--color-dark-brown)',
          color: 'var(--color-beige)',
          border: '1px solid var(--color-beige)',
          maxWidth: 'min(90vw, 45.6rem)',
          textAlign: 'center',
        },
      }}
    />
  )
}
