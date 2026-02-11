import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './i18n/i18n'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 30, // 30 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})

import { SchoolProvider } from './contexts/SchoolContext'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <SchoolProvider>
                    <App />
                </SchoolProvider>
            </QueryClientProvider>
        </HelmetProvider>
    </React.StrictMode>,
)

// Register Service Worker
// Register Service Worker (Production Only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
