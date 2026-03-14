import { useRef, useEffect, useCallback } from 'react';
import './SearchBox.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const SearchBox = ({ searchText, onSearchTextChange, listening, onToggleListening }) => {
    const searchContainerRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 0);
        return () => clearTimeout(timer);
    }, []);

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
        };
    }, [onSearchTextChange, onToggleListening]);

    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (listening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    }, [listening]);

    const handleMicClick = useCallback(() => {
        if (!SpeechRecognition) return;
        onToggleListening(!listening);
    }, [listening, onToggleListening]);

    const micSupported = !!SpeechRecognition;
    const micSrc = !micSupported
        ? '/images/mic-slash.gif'
        : listening
            ? '/images/mic-animate.gif'
            : '/images/mic.gif';

    return (
        <div className={`search-container ${listening ? 'listening' : ''}`} ref={searchContainerRef}>
            <div className="search-text">
                <textarea
                    id="searchBox"
                    placeholder={listening ? 'Listening...' : 'Type the lyrics'}
                    ref={inputRef}
                    value={searchText}
                    onChange={(e) => onSearchTextChange(e.target.value)}
                />
            </div>
            <div className="microphone" onClick={handleMicClick}>
                <img
                    src={micSrc}
                    className={`microphone-img ${listening ? 'mic-active' : ''}`}
                    alt={listening ? 'Stop listening' : 'Start voice input'}
                    draggable={false}
                />
                {!micSupported && <span className="mic-unsupported">Not supported</span>}
            </div>
        </div>
    );
};

export default SearchBox;
