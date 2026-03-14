import { useRef, useEffect } from 'react';
import './SearchBox.css';

const SearchBox = () => {
    const searchContainerRef = useRef(null);
    const inputRef = useRef(null);
    const micImgRef = useRef(null);

    useEffect(() => {
        if (micImgRef.current) {
            micImgRef.current.draggable = false;
        }
        const timer = setTimeout(() => inputRef.current?.focus(), 0);
        return () => clearTimeout(timer);
    }, []);

    const focusInput = () => {
        searchContainerRef.current?.classList.add('focusInput');
    };

    const blurInput = () => {
        searchContainerRef.current?.classList.remove('focusInput');
    };

    const focusMic = () => {
        searchContainerRef.current?.classList.add('focusInput');
        if (micImgRef.current) {
            micImgRef.current.src = '/images/mic-animate.gif';
        }
    };

    const blurMic = () => {
        searchContainerRef.current?.classList.remove('focusInput');
        if (micImgRef.current) {
            micImgRef.current.src = '/images/mic.gif';
        }
    };

    return (
        <div className="search-container" ref={searchContainerRef}>
            <div className="search-text">
                <form>
                    <textarea
                        id="searchBox"
                        placeholder="Type the lyrics"
                        ref={inputRef}
                        onFocus={focusInput}
                        onBlur={blurInput}
                    ></textarea>
                </form>
            </div>
            <div className="microphone">
                <img
                    src="/images/mic.gif"
                    className="microphone-img"
                    alt="Microphone"
                    ref={micImgRef}
                    tabIndex="0"
                    onFocus={focusMic}
                    onBlur={blurMic}
                />
            </div>
        </div>
    );
};

export default SearchBox;
