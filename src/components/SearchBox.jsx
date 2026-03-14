import { useRef, useEffect, useCallback } from 'react';
import './SearchBox.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const SILENCE_TIMEOUT_MS = 5000;

const SearchBox = ({ searchText, onSearchTextChange, listening, onToggleListening, onSearch }) => {
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 0);
        return () => clearTimeout(timer);
    }, []);

    const resetSilenceTimer = useCallback(() => {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
            onToggleListening(false);
        }, SILENCE_TIMEOUT_MS);
    }, [onToggleListening]);

    useEffect(() => {
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let transcript = '';
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            onSearchTextChange(transcript);
            resetSilenceTimer();
        };

        recognition.onerror = (event) => {
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
            clearTimeout(silenceTimerRef.current);
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
            clearTimeout(silenceTimerRef.current);
        }
    }, [listening, resetSilenceTimer]);

    const handleMicClick = useCallback(() => {
        if (!SpeechRecognition) return;
        onToggleListening(!listening);
    }, [listening, onToggleListening]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSearch();
        }
        if (e.key === 'Escape' && listening) {
            onToggleListening(false);
        }
    };

    const micSupported = !!SpeechRecognition;
    const micSrc = !micSupported
        ? '/images/mic-slash.gif'
        : listening
            ? '/images/mic-animate.gif'
            : '/images/mic.gif';

    const micTitle = !micSupported
        ? 'Speech recognition not supported in this browser'
        : listening
            ? 'Click to stop listening'
            : 'Click to speak lyrics';

    return (
        <div className={`search-container ${listening ? 'listening' : ''}`}>
            <div className="search-text">
                <textarea
                    id="searchBox"
                    placeholder={listening ? 'Listening... (stops after 5s of silence)' : 'Type the lyrics'}
                    ref={inputRef}
                    value={searchText}
                    onChange={(e) => onSearchTextChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className="microphone" onClick={handleMicClick} title={micTitle}>
                <img
                    src={micSrc}
                    className={`microphone-img ${listening ? 'mic-active' : ''}`}
                    alt={micTitle}
                    draggable={false}
                />
                {!micSupported && <span className="mic-unsupported">Not supported</span>}
            </div>
        </div>
    );
};

export default SearchBox;
