import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SuggestTrack, LoadingStatus } from '../types';
import { searchSongs, fetchLyrics } from '../services/api';

function queryStatus(enabled: boolean, query: { isLoading: boolean; isError: boolean; isSuccess: boolean }): LoadingStatus {
    if (!enabled) return 'idle';
    if (query.isLoading) return 'loading';
    if (query.isError) return 'error';
    if (query.isSuccess) return 'success';
    return 'idle';
}

const DEBOUNCE_MS = 300;

export function useSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTrack, setSelectedTrack] = useState<SuggestTrack | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const searchQuery = useQuery({
        queryKey: ['search', searchTerm],
        queryFn: () => searchSongs(searchTerm),
        enabled: searchTerm.length > 0,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    const lyricsQuery = useQuery({
        queryKey: ['lyrics', selectedTrack?.artist.name, selectedTrack?.title_short],
        queryFn: () => fetchLyrics(selectedTrack!.title_short, selectedTrack!.artist.name),
        enabled: !!selectedTrack,
        staleTime: 10 * 60 * 1000,
        retry: 2,
    });

    const search = useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setSelectedTrack(null);

        debounceRef.current = setTimeout(() => {
            setSearchTerm(query);
        }, DEBOUNCE_MS);
    }, []);

    const selectTrack = useCallback((track: SuggestTrack) => {
        setSelectedTrack(track);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedTrack(null);
    }, []);

    const clearResults = useCallback(() => {
        setSearchTerm('');
        setSelectedTrack(null);
    }, []);

    return {
        status: queryStatus(searchTerm.length > 0, searchQuery),
        results: searchQuery.data ?? [],
        error: searchQuery.error?.message ?? null,
        selectedTrack,
        lyricsStatus: queryStatus(!!selectedTrack, lyricsQuery),
        lyrics: lyricsQuery.data ?? null,
        search,
        selectTrack,
        clearSelection,
        clearResults,
    };
}
