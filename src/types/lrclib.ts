// lyrics.ovh /suggest response (powered by Deezer)
export interface SuggestTrack {
    id: number;
    title: string;
    title_short: string;
    duration: number;
    artist: {
        name: string;
        picture_medium: string;
    };
    album: {
        title: string;
        cover_medium: string;
    };
}

export interface SuggestResponse {
    data: SuggestTrack[];
}

// LRCLIB response for fetching lyrics
export interface LrclibTrack {
    id: number;
    trackName: string;
    artistName: string;
    albumName: string;
    duration: number;
    instrumental: boolean;
    plainLyrics: string | null;
    syncedLyrics: string | null;
}

// App state
export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
export type LyricsStatus = 'idle' | 'loading' | 'success' | 'error';

export interface SearchState {
    status: SearchStatus;
    results: SuggestTrack[];
    error: string | null;
    selectedTrack: SuggestTrack | null;
    lyricsStatus: LyricsStatus;
    lyrics: string | null;
}
