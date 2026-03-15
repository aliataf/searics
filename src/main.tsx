import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './containers/App';
import ErrorBoundary from './components/ErrorBoundary';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root')!);
root.render(
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </ErrorBoundary>
);
