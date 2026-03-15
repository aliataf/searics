import { useState, useCallback, useRef } from 'react';
import type { SuggestTrack, SearchState } from '../types';
import { searchSongs, fetchLyrics } from '../services/api';

const INITIAL_STATE: SearchState = {
    status: 'idle',
    results: [],
    error: null,
    selectedTrack: null,
    lyricsStatus: 'idle',
    lyrics: null,
};

const DEBOUNCE_MS = 300;

export function useSearch() {
    const [state, setState] = useState<SearchState>(INITIAL_STATE);
    const abortRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback((query: string) => {
        // Cancel pending debounce and in-flight request
        if (debounceRef.current) clearTimeout(debounceRef.current);
        abortRef.current?.abort();

        setState(prev => ({ ...prev, status: 'loading', error: null, selectedTrack: null, lyricsStatus: 'idle', lyrics: null }));

        debounceRef.current = setTimeout(async () => {
            const controller = new AbortController();
            abortRef.current = controller;

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
        }, DEBOUNCE_MS);
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
