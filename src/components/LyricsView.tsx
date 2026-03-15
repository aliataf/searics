import type { SuggestTrack } from '../types/lrclib';
import type { LyricsStatus } from '../types/lrclib';
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
        <div className="lyrics-container">
            <button className="lyrics-back" onClick={onBack}>
                &larr; Back to results
            </button>
            <div className="lyrics-header">
                <img
                    className="lyrics-cover"
                    src={track.album.cover_medium}
                    alt={track.album.title}
                />
                <div className="lyrics-meta">
                    <h2 className="lyrics-title">{track.title_short}</h2>
                    <span className="lyrics-artist">{track.artist.name}</span>
                    <span className="lyrics-album">{track.album.title}</span>
                </div>
            </div>
            <div className="lyrics-body">
                {lyricsStatus === 'loading' && <LoadingSpinner />}
                {lyricsStatus === 'error' && 'Failed to load lyrics.'}
                {lyricsStatus === 'success' && (lyrics || 'Lyrics not available for this track.')}
            </div>
        </div>
    );
};

export default LyricsView;
