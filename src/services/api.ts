import type { SuggestResponse, SuggestTrack, LrclibTrack } from '../types';

const SUGGEST_URL = import.meta.env.VITE_SUGGEST_API_URL as string;
const LRCLIB_URL = import.meta.env.VITE_LRCLIB_API_URL as string;

export async function searchSongs(query: string): Promise<SuggestTrack[]> {
    const response = await fetch(
        `${SUGGEST_URL}/${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error(`Search failed (${response.status})`);
    }

    const data: SuggestResponse = await response.json();
    return data.data ?? [];
}

export async function fetchLyrics(trackName: string, artistName: string): Promise<string | null> {
    const query = `${artistName} ${trackName}`;
    const response = await fetch(
        `${LRCLIB_URL}?q=${encodeURIComponent(query)}`
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
