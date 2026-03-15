import { useState, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { LoadingStatus } from '../types';
import { searchSongs } from '../services/api';

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
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const searchQuery = useQuery({
        queryKey: ['search', searchTerm],
        queryFn: () => searchSongs(searchTerm),
        enabled: searchTerm.length > 0,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    const search = useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setSearchTerm(query);
        }, DEBOUNCE_MS);
    }, []);

    return {
        status: queryStatus(searchTerm.length > 0, searchQuery),
        results: searchQuery.data ?? [],
        error: searchQuery.error?.message ?? null,
        search,
    };
}
