import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './containers/App';
import LyricsPage from './containers/LyricsPage';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root')!);
root.render(
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/lyrics/:artist/:track" element={<LyricsPage />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </ErrorBoundary>
);
