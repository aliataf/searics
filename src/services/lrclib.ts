import type { SuggestResponse, SuggestTrack, LrclibTrack } from '../types/lrclib';

const SUGGEST_URL = 'https://api.lyrics.ovh/suggest';
const LRCLIB_URL = 'https://lrclib.net/api/search';

export async function searchSongs(query: string, signal?: AbortSignal): Promise<SuggestTrack[]> {
    const response = await fetch(
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
    const response = await fetch(
        `${LRCLIB_URL}?q=${encodeURIComponent(query)}`,
        { signal }
    );

    if (!response.ok) return null;

    const results: LrclibTrack[] = await response.json();
    if (results.length === 0) return null;

    // Find best match by checking artist and track name
    const match = results.find(
        r => r.artistName.toLowerCase() === artistName.toLowerCase()
            && r.trackName.toLowerCase().includes(trackName.toLowerCase())
    ) ?? results[0];

    return match.plainLyrics ?? null;
}
