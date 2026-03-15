import { useState, useCallback, useRef } from 'react';
import type { SuggestTrack, SearchState } from '../types/lrclib';
import { searchSongs, fetchLyrics } from '../services/lrclib';

const INITIAL_STATE: SearchState = {
    status: 'idle',
    results: [],
    error: null,
    selectedTrack: null,
    lyricsStatus: 'idle',
    lyrics: null,
};

export function useLrclib() {
    const [state, setState] = useState<SearchState>(INITIAL_STATE);
    const abortRef = useRef<AbortController | null>(null);

    const search = useCallback(async (query: string) => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setState(prev => ({ ...prev, status: 'loading', error: null, selectedTrack: null, lyricsStatus: 'idle', lyrics: null }));

        try {
            const results = await searchSongs(query, controller.signal);
            setState(prev => ({ ...prev, status: 'success', results, error: null }));
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return;
            setState(prev => ({
                ...prev,
                status: 'error',
                results: [],
                error: err instanceof Error ? err.message : 'Something went wrong',
            }));
        }
    }, []);

    const selectTrack = useCallback(async (track: SuggestTrack) => {
        setState(prev => ({ ...prev, selectedTrack: track, lyricsStatus: 'loading', lyrics: null }));

        try {
            const lyrics = await fetchLyrics(track.title_short, track.artist.name);
            setState(prev => ({ ...prev, lyricsStatus: 'success', lyrics }));
        } catch {
            setState(prev => ({ ...prev, lyricsStatus: 'error', lyrics: null }));
        }
    }, []);

    const clearSelection = useCallback(() => {
        setState(prev => ({ ...prev, selectedTrack: null, lyricsStatus: 'idle', lyrics: null }));
    }, []);

    const clearResults = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);

    return { ...state, search, selectTrack, clearSelection, clearResults };
}
