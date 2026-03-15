import { useState } from 'react';
import type { LoadingStatus } from '../types';
import { toSlug } from '../utils/slug';
import LoadingSpinner from './LoadingSpinner';
import './LyricsView.css';

interface LyricsViewProps {
    trackName: string;
    artistName: string;
    albumTitle?: string;
    coverUrl?: string;
    lyricsStatus: LoadingStatus;
    lyrics: string | null;
    onBack: () => void;
}

const LyricsView = ({ trackName, artistName, albumTitle, coverUrl, lyricsStatus, lyrics, onBack }: LyricsViewProps) => {
    const [copied, setCopied] = useState(false);

    const shareUrl = `${window.location.origin}/lyrics/${toSlug(artistName)}/${toSlug(trackName)}`;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = shareUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <article className="lyrics-container" aria-label={`Lyrics for ${trackName} by ${artistName}`}>
            <div className="lyrics-actions">
                <button className="lyrics-back" onClick={onBack} aria-label="Back to search results">
                    &larr; Back to results
                </button>
                <button className="lyrics-share" onClick={handleShare} aria-label="Copy share link">
                    {copied ? 'Copied!' : 'Share'}
                </button>
            </div>
            <header className="lyrics-header">
                {coverUrl && (
                    <img
                        className="lyrics-cover"
                        src={coverUrl}
                        alt=""
                        aria-hidden="true"
                    />
                )}
                <div className="lyrics-meta">
                    <h2 className="lyrics-title">{trackName}</h2>
                    <span className="lyrics-artist">{artistName}</span>
                    {albumTitle && <span className="lyrics-album">{albumTitle}</span>}
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
