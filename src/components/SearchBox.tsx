import { useRef, useEffect, useCallback, type KeyboardEvent } from 'react';
import './SearchBox.css';

const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
const SILENCE_TIMEOUT_MS = 5000;

interface SearchBoxProps {
    searchText: string;
    onSearchTextChange: (text: string) => void;
    listening: boolean;
    onToggleListening: (value: boolean) => void;
    onSearch: () => void;
}

const SearchBox = ({ searchText, onSearchTextChange, listening, onToggleListening, onSearch }: SearchBoxProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 0);
        return () => clearTimeout(timer);
    }, []);

    // Global "/" shortcut to focus search
    useEffect(() => {
        const handleGlobalKey = (e: globalThis.KeyboardEvent) => {
            const active = document.activeElement;
            const isTyping = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
            if (isTyping) return;
            if (e.key === '/') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleGlobalKey);
        return () => document.removeEventListener('keydown', handleGlobalKey);
    }, []);

    const resetSilenceTimer = useCallback(() => {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
            onToggleListening(false);
        }, SILENCE_TIMEOUT_MS);
    }, [onToggleListening]);

    useEffect(() => {
        if (!SpeechRecognitionApi) return;

        const recognition = new SpeechRecognitionApi();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            onSearchTextChange(transcript);
            resetSilenceTimer();
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            if (event.error !== 'aborted') {
                onToggleListening(false);
            }
        };

        recognition.onend = () => {
            onToggleListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.abort();
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };
    }, [onSearchTextChange, onToggleListening, resetSilenceTimer]);

    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (listening) {
            recognition.start();
            resetSilenceTimer();
        } else {
            recognition.stop();
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        }
    }, [listening, resetSilenceTimer]);

    const handleMicClick = useCallback(() => {
        if (!SpeechRecognitionApi) return;
        onToggleListening(!listening);
    }, [listening, onToggleListening]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
        }
        if (e.key === 'Escape') {
            if (listening) {
                onToggleListening(false);
            } else {
                inputRef.current?.blur();
            }
        }
    };

    const handleClear = () => {
        onSearchTextChange('');
        inputRef.current?.focus();
    };

    const micSupported = !!SpeechRecognitionApi;

    return (
        <div className={`search-bar ${listening ? 'listening' : ''}`}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>

            <input
                type="text"
                className="search-input"
                placeholder={listening ? 'Listening...' : 'Search by song, artist, or lyrics...'}
                ref={inputRef}
                value={searchText}
                onChange={(e) => onSearchTextChange(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Search lyrics"
            />

            {searchText && (
                <button className="search-clear" onClick={handleClear} aria-label="Clear search" title="Clear">
                    &times;
                </button>
            )}

            {micSupported && (
                <button
                    className={`search-mic ${listening ? 'mic-active' : ''}`}
                    onClick={handleMicClick}
                    aria-label={listening ? 'Stop listening' : 'Voice search'}
                    title={listening ? 'Stop listening' : 'Voice search'}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                </button>
            )}

            <button
                className="search-submit"
                onClick={onSearch}
                disabled={!searchText.trim()}
                aria-label="Search"
            >
                Search
            </button>
        </div>
    );
};

export default SearchBox;
