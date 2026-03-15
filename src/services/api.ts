import type { SuggestResponse, SuggestTrack, LrclibTrack } from '../types';

const SUGGEST_URL = import.meta.env.VITE_SUGGEST_API_URL as string;
const LRCLIB_URL = import.meta.env.VITE_LRCLIB_API_URL as string;

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

async function fetchWithRetry(url: string, options?: RequestInit, retries = MAX_RETRIES): Promise<Response> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (response.ok || attempt === retries) return response;
        } catch (err) {
            if (attempt === retries) throw err;
            // Don't retry aborted requests
            if (err instanceof DOMException && err.name === 'AbortError') throw err;
        }
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
    }
    // Unreachable, but satisfies TypeScript
    throw new Error('Fetch failed');
}

export async function searchSongs(query: string, signal?: AbortSignal): Promise<SuggestTrack[]> {
    const response = await fetchWithRetry(
        `${SUGGEST_URL}/${encodeURIComponent(query)}`,
        { signal }
    );

    if (!response.ok) {
        throw new Error(`Search failed (${response.status})`);
    }

    const data: SuggestResponse = await response.json();
    return data.data ?? [];
}

export async function fetchLyrics(trackName: string, artistName: string, signal?: AbortSignal): Promise<string | null> {
    const query = `${artistName} ${trackName}`;
    const response = await fetchWithRetry(
        `${LRCLIB_URL}?q=${encodeURIComponent(query)}`,
        { signal }
    );

    if (!response.ok) return null;

    const results: LrclibTrack[] = await response.json();
    if (results.length === 0) return null;

    const match = results.find(
        r => r.artistName.toLowerCase() === artistName.toLowerCase()
            && r.trackName.toLowerCase().includes(trackName.toLowerCase())
    ) ?? results[0];

    return match.plainLyrics ?? null;
}
