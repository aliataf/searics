import type { SuggestTrack, LyricsStatus } from '../types';
import LoadingSpinner from './LoadingSpinner';
import './LyricsView.css';

interface LyricsViewProps {
    track: SuggestTrack;
    lyricsStatus: LyricsStatus;
    lyrics: string | null;
    onBack: () => void;
}

const LyricsView = ({ track, lyricsStatus, lyrics, onBack }: LyricsViewProps) => {
    return (
        <article className="lyrics-container" aria-label={`Lyrics for ${track.title_short} by ${track.artist.name}`}>
            <button className="lyrics-back" onClick={onBack} aria-label="Back to search results">
                &larr; Back to results
            </button>
            <header className="lyrics-header">
                <img
                    className="lyrics-cover"
                    src={track.album.cover_medium}
                    alt=""
                    aria-hidden="true"
                />
                <div className="lyrics-meta">
                    <h2 className="lyrics-title">{track.title_short}</h2>
                    <span className="lyrics-artist">{track.artist.name}</span>
                    <span className="lyrics-album">{track.album.title}</span>
                </div>
            </header>
            <div className="lyrics-body" role="article" aria-label="Song lyrics">
                {lyricsStatus === 'loading' && <LoadingSpinner />}
                {lyricsStatus === 'error' && <p role="alert">Failed to load lyrics.</p>}
                {lyricsStatus === 'success' && (lyrics || 'Lyrics not available for this track.')}
            </div>
        </article>
    );
};

export default LyricsView;
