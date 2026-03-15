import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import Header from '../components/Header';
import './NotFound.css';

const NotFound = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="App">
            <Header theme={theme} onToggleTheme={toggleTheme} />
            <div className="not-found">
                <span className="not-found-code">404</span>
                <h2 className="not-found-title">Page not found</h2>
                <p className="not-found-text">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="not-found-link">
                    Go to search
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
