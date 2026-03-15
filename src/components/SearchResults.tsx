import type { SuggestTrack } from '../types';
import './SearchResults.css';

interface SearchResultsProps {
    results: SuggestTrack[];
    onSelectTrack: (track: SuggestTrack) => void;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = String(Math.round(seconds % 60)).padStart(2, '0');
    return `${mins}:${secs}`;
}

const SearchResults = ({ results, onSelectTrack }: SearchResultsProps) => {
    if (results.length === 0) {
        return (
            <div className="results-empty">
                No songs found. Try a different search.
            </div>
        );
    }

    return (
        <div className="results-container">
            {results.map((track) => (
                <div
                    key={track.id}
                    className="result-card"
                    onClick={() => onSelectTrack(track)}
                >
                    <img
                        className="result-cover"
                        src={track.album.cover_medium}
                        alt={track.album.title}
                    />
                    <div className="result-info">
                        <span className="result-title">{track.title_short}</span>
                        <span className="result-artist">{track.artist.name}</span>
                        <span className="result-album">{track.album.title}</span>
                    </div>
                    <div className="result-meta">
                        <span className="result-duration">{formatDuration(track.duration)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;
