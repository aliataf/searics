import './LoadingSpinner.css';

const LoadingSpinner = () => {
    return (
        <div className="spinner-container" role="status" aria-label="Loading">
            <div className="spinner" aria-hidden="true" />
            <span className="spinner-text">Searching...</span>
        </div>
    );
};

export default LoadingSpinner;
