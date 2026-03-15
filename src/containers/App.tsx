import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import ParticlesComponent from '../components/ParticlesComponent';
import ResultSkeleton from '../components/ResultSkeleton';
import SearchResults from '../components/SearchResults';
import SuggestChips from '../components/SuggestChips';
import { useSearch } from '../hooks/useSearch';
import type { SuggestTrack } from '../types';
import { toSlug } from '../utils/slug';

const App = () => {
    const [searchText, setSearchText] = useState('');
    const [listening, setListening] = useState(false);
    const { status, results, error, search } = useSearch();
    const navigate = useNavigate();

    const handleToggleListening = useCallback((value: boolean) => {
        setListening(value);
    }, []);

    const handleSearch = useCallback(() => {
        if (!searchText.trim()) return;
        search(searchText.trim());
    }, [searchText, search]);

    const handleChipSelect = useCallback((query: string) => {
        setSearchText(query);
        search(query);
    }, [search]);

    const handleSelectTrack = useCallback((track: SuggestTrack) => {
        navigate(`/lyrics/${toSlug(track.artist.name)}/${toSlug(track.title_short)}`);
    }, [navigate]);

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

            {status === 'idle' && <SuggestChips onSelect={handleChipSelect} />}

            {status === 'loading' && <ResultSkeleton />}

            {status === 'error' && (
                <div className="error-message">{error}</div>
            )}

            {status === 'success' && (
                <SearchResults results={results} onSelectTrack={handleSelectTrack} />
            )}
        </div>
    );
};

export default App;
