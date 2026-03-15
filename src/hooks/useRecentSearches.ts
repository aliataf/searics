import { useState, useCallback } from 'react';

const STORAGE_KEY = 'searics_recent';
const MAX_RECENT = 8;

function load(): string[] {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function save(searches: string[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export function useRecentSearches() {
    const [recent, setRecent] = useState<string[]>(load);

    const addRecent = useCallback((query: string) => {
        setRecent(prev => {
            const filtered = prev.filter(s => s.toLowerCase() !== query.toLowerCase());
            const updated = [query, ...filtered].slice(0, MAX_RECENT);
            save(updated);
            return updated;
        });
    }, []);

    const clearRecent = useCallback(() => {
        setRecent([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return { recent, addRecent, clearRecent };
}
