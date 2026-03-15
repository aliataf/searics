import './LoadingSpinner.css';

const LoadingSpinner = () => {
    return (
        <div className="spinner-container">
            <div className="spinner" />
            <span className="spinner-text">Searching...</span>
        </div>
    );
};

export default LoadingSpinner;
