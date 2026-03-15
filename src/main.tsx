import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';

const App = lazy(() => import('./containers/App'));
const LyricsPage = lazy(() => import('./containers/LyricsPage'));
const NotFound = lazy(() => import('./containers/NotFound'));

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root')!);
root.render(
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ScrollToTop />
                <Suspense fallback={<div className="App"><LoadingSpinner /></div>}>
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/lyrics/:artist/:track" element={<LyricsPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </QueryClientProvider>
    </ErrorBoundary>
);
