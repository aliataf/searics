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
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const searchCache = new Map<string, CacheEntry<SuggestTrack[]>>();
const lyricsCache = new Map<string, CacheEntry<string | null>>();

function getCached<T>(cache: Map<string, CacheEntry<T>>, key: string): T | undefined {
    const entry = cache.get(key);
    if (!entry) return undefined;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
        cache.delete(key);
        return undefined;
    }
    return entry.data;
}

function setCache<T>(cache: Map<string, CacheEntry<T>>, key: string, data: T) {
    cache.set(key, { data, timestamp: Date.now() });
}

export function useSearch() {
    const [state, setState] = useState<SearchState>(INITIAL_STATE);
    const abortRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        abortRef.current?.abort();

        const cached = getCached(searchCache, query);
        if (cached) {
            setState(prev => ({ ...prev, status: 'success', results: cached, error: null, selectedTrack: null, lyricsStatus: 'idle', lyrics: null }));
            return;
        }

        setState(prev => ({ ...prev, status: 'loading', error: null, selectedTrack: null, lyricsStatus: 'idle', lyrics: null }));

        debounceRef.current = setTimeout(async () => {
            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const results = await searchSongs(query, controller.signal);
                setCache(searchCache, query, results);
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
        const cacheKey = `${track.artist.name}:${track.title_short}`;
        const cached = getCached(lyricsCache, cacheKey);

        if (cached !== undefined) {
            setState(prev => ({ ...prev, selectedTrack: track, lyricsStatus: 'success', lyrics: cached }));
            return;
        }

        setState(prev => ({ ...prev, selectedTrack: track, lyricsStatus: 'loading', lyrics: null }));

        try {
            const lyrics = await fetchLyrics(track.title_short, track.artist.name);
            setCache(lyricsCache, cacheKey, lyrics);
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
