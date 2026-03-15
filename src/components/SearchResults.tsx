import type { KeyboardEvent } from 'react';
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
            <div className="results-empty" role="status">
                No songs found. Try a different search.
            </div>
        );
    }

    const handleKeyDown = (e: KeyboardEvent, track: SuggestTrack) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectTrack(track);
        }
    };

    return (
        <div>
            <div className="results-count" role="status">
                {results.length} {results.length === 1 ? 'result' : 'results'} found
            </div>
            <div className="results-container" role="list" aria-label="Search results">
            {results.map((track) => (
                <div
                    key={track.id}
                    className="result-card"
                    role="listitem"
                    tabIndex={0}
                    aria-label={`${track.title_short} by ${track.artist.name}`}
                    onClick={() => onSelectTrack(track)}
                    onKeyDown={(e) => handleKeyDown(e, track)}
                >
                    <img
                        className="result-cover"
                        src={track.album.cover_medium}
                        alt=""
                        aria-hidden="true"
                    />
                    <div className="result-info">
                        <span className="result-title">{track.title_short}</span>
                        <span className="result-artist">{track.artist.name}</span>
                        <span className="result-album">{track.album.title}</span>
                    </div>
                    <div className="result-meta">
                        <span className="result-duration" aria-label={`Duration ${formatDuration(track.duration)}`}>
                            {formatDuration(track.duration)}
                        </span>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default SearchResults;
