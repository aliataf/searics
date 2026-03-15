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
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedLyrics, setCopiedLyrics] = useState(false);

    const shareUrl = `${window.location.origin}/lyrics/${toSlug(artistName)}/${toSlug(trackName)}`;

    const handleShare = async () => {
        await copyToClipboard(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handleCopyLyrics = async () => {
        if (!lyrics) return;
        await copyToClipboard(lyrics);
        setCopiedLyrics(true);
        setTimeout(() => setCopiedLyrics(false), 2000);
    };

    const jsonLd = lyricsStatus === 'success' && lyrics ? {
        '@context': 'https://schema.org',
        '@type': 'MusicComposition',
        name: trackName,
        composer: { '@type': 'Person', name: artistName },
        lyrics: { '@type': 'CreativeWork', text: lyrics.slice(0, 500) },
    } : null;

    return (
        <article className="lyrics-container" aria-label={`Lyrics for ${trackName} by ${artistName}`}>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <div className="lyrics-actions">
                <button className="lyrics-btn" onClick={onBack} aria-label="Back to search results">
                    &larr; Back
                </button>
                <div className="lyrics-actions-right">
                    {lyricsStatus === 'success' && lyrics && (
                        <button className="lyrics-btn" onClick={handleCopyLyrics} aria-label="Copy lyrics">
                            {copiedLyrics ? 'Copied!' : 'Copy lyrics'}
                        </button>
                    )}
                    <button className="lyrics-btn" onClick={handleShare} aria-label="Copy share link">
                        {copiedLink ? 'Link copied!' : 'Share'}
                    </button>
                </div>
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

async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

export default LyricsView;
