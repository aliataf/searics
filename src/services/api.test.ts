import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { searchSongs, fetchLyrics } from './api';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
    mockFetch.mockReset();
});

describe('searchSongs', () => {
    it('returns tracks from lyrics.ovh suggest API', async () => {
        const mockData = {
            data: [
                { id: 1, title: 'Bohemian Rhapsody', title_short: 'Bohemian Rhapsody', duration: 354, artist: { name: 'Queen', picture_medium: '' }, album: { title: 'A Night at the Opera', cover_medium: '' } },
            ],
        };
        mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockData) });

        const results = await searchSongs('bohemian');
        expect(results).toHaveLength(1);
        expect(results[0].title_short).toBe('Bohemian Rhapsody');
        expect(results[0].artist.name).toBe('Queen');
    });

    it('throws on non-OK response after retries', async () => {
        // fetchWithRetry retries up to 2 times (3 calls total)
        mockFetch.mockResolvedValue({ ok: false, status: 500 });
        await expect(searchSongs('test')).rejects.toThrow('Search failed (500)');
        expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('returns empty array when data is null', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: null }) });
        const results = await searchSongs('nothing');
        expect(results).toEqual([]);
    });
});

describe('fetchLyrics', () => {
    it('returns lyrics from best matching LRCLIB result', async () => {
        const mockResults = [
            { artistName: 'Queen', trackName: 'Bohemian Rhapsody', plainLyrics: 'Is this the real life?' },
            { artistName: 'Queen', trackName: 'Another Song', plainLyrics: 'Other lyrics' },
        ];
        mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockResults) });

        const lyrics = await fetchLyrics('Bohemian Rhapsody', 'Queen');
        expect(lyrics).toBe('Is this the real life?');
    });

    it('returns null when no results found', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
        const lyrics = await fetchLyrics('Unknown', 'Nobody');
        expect(lyrics).toBeNull();
    });

    it('returns null on API failure after retries', async () => {
        mockFetch.mockResolvedValue({ ok: false, status: 500 });
        const lyrics = await fetchLyrics('Test', 'Artist');
        expect(lyrics).toBeNull();
    });

    it('falls back to first result when no exact match', async () => {
        const mockResults = [
            { artistName: 'Other Artist', trackName: 'Some Song', plainLyrics: 'Fallback lyrics' },
        ];
        mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockResults) });

        const lyrics = await fetchLyrics('Bohemian Rhapsody', 'Queen');
        expect(lyrics).toBe('Fallback lyrics');
    });
});
