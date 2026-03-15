import { useState, useCallback } from 'react';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import SearchButton from '../components/SearchButton';
import ParticlesComponent from '../components/ParticlesComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchResults from '../components/SearchResults';
import LyricsView from '../components/LyricsView';
import { useLrclib } from '../hooks/useLrclib';

const App = () => {
    const [searchText, setSearchText] = useState('');
    const [listening, setListening] = useState(false);
    const { status, results, error, selectedTrack, lyricsStatus, lyrics, search, selectTrack, clearSelection } = useLrclib();

    const handleToggleListening = useCallback((value: boolean) => {
        setListening(value);
    }, []);

    const handleSearch = useCallback(() => {
        if (!searchText.trim()) return;
        search(searchText.trim());
    }, [searchText, search]);

    return (
        <div className="App">
            <ParticlesComponent />
            <Header />
            <SearchBox
                searchText={searchText}
                onSearchTextChange={setSearchText}
                listening={listening}
                onToggleListening={handleToggleListening}
                onSearch={handleSearch}
            />
            <SearchButton searchText={searchText} onSearch={handleSearch} />

            {status === 'loading' && <LoadingSpinner />}

            {status === 'error' && (
                <div className="error-message">{error}</div>
            )}

            {status === 'success' && !selectedTrack && (
                <SearchResults results={results} onSelectTrack={selectTrack} />
            )}

            {selectedTrack && (
                <LyricsView
                    track={selectedTrack}
                    lyricsStatus={lyricsStatus}
                    lyrics={lyrics}
                    onBack={clearSelection}
                />
            )}
        </div>
    );
};

export default App;
