import { createRoot } from 'react-dom/client';
import './index.css';
import App from './containers/App';
import ErrorBoundary from './components/ErrorBoundary';

const root = createRoot(document.getElementById('root')!);
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);
