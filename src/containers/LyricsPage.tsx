import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import LyricsView from '../components/LyricsView';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchLyrics } from '../services/api';
import { fromSlug } from '../utils/slug';
import { useTheme } from '../hooks/useTheme';

const LyricsPage = () => {
    const { theme, toggleTheme } = useTheme();
    const { artist, track } = useParams<{ artist: string; track: string }>();
    const navigate = useNavigate();

    const artistName = fromSlug(artist ?? '');
    const trackName = fromSlug(track ?? '');

    const lyricsQuery = useQuery({
        queryKey: ['lyrics', artistName, trackName],
        queryFn: () => fetchLyrics(trackName, artistName),
        enabled: !!artistName && !!trackName,
        staleTime: 10 * 60 * 1000,
        retry: 2,
    });

    const lyricsStatus = lyricsQuery.isLoading ? 'loading' as const
        : lyricsQuery.isError ? 'error' as const
        : lyricsQuery.isSuccess ? 'success' as const
        : 'idle' as const;

    // Dynamic page title
    useEffect(() => {
        if (trackName && artistName) {
            document.title = `${trackName} Lyrics - ${artistName} | Searics`;
        }
        return () => { document.title = 'Searics - Find lyrics for any song'; };
    }, [trackName, artistName]);

    return (
        <div className="App">
            <Header theme={theme} onToggleTheme={toggleTheme} />

            {!artistName || !trackName ? (
                <div className="error-message">Invalid lyrics URL.</div>
            ) : lyricsStatus === 'loading' ? (
                <LoadingSpinner />
            ) : (
                <LyricsView
                    trackName={trackName}
                    artistName={artistName}
                    lyricsStatus={lyricsStatus}
                    lyrics={lyricsQuery.data ?? null}
                    onBack={() => navigate('/')}
                />
            )}
        </div>
    );
};

export default LyricsPage;
