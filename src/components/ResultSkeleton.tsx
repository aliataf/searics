import './ResultSkeleton.css';

const SKELETON_COUNT = 5;

const ResultSkeleton = () => {
    return (
        <div className="results-container" aria-busy="true" aria-label="Loading results">
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <div key={i} className="skeleton-card">
                    <div className="skeleton-cover shimmer" />
                    <div className="skeleton-info">
                        <div className="skeleton-line skeleton-title shimmer" />
                        <div className="skeleton-line skeleton-artist shimmer" />
                        <div className="skeleton-line skeleton-album shimmer" />
                    </div>
                    <div className="skeleton-duration shimmer" />
                </div>
            ))}
        </div>
    );
};

export default ResultSkeleton;
