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

// Status types used by components
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';
