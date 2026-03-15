import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import ResultSkeleton from '../components/ResultSkeleton';
import SearchResults from '../components/SearchResults';
import SuggestChips from '../components/SuggestChips';
import Footer from '../components/Footer';
import { useSearch } from '../hooks/useSearch';
import { useTheme } from '../hooks/useTheme';
import { useRecentSearches } from '../hooks/useRecentSearches';
import type { SuggestTrack } from '../types';
import { toSlug } from '../utils/slug';

const App = () => {
    const [searchText, setSearchText] = useState('');
    const [listening, setListening] = useState(false);
    const { status, results, error, search } = useSearch();
    const { recent, addRecent, clearRecent } = useRecentSearches();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleToggleListening = useCallback((value: boolean) => {
        setListening(value);
    }, []);

    const doSearch = useCallback((query: string) => {
        setSearchText(query);
        search(query);
        addRecent(query);
    }, [search, addRecent]);

    const handleSearch = useCallback(() => {
        if (!searchText.trim()) return;
        doSearch(searchText.trim());
    }, [searchText, doSearch]);

    const handleSelectTrack = useCallback((track: SuggestTrack) => {
        navigate(`/lyrics/${toSlug(track.artist.name)}/${toSlug(track.title_short)}`);
    }, [navigate]);

    return (
        <div className="App">
            <Header theme={theme} onToggleTheme={toggleTheme} />
            <SearchBox
                searchText={searchText}
                onSearchTextChange={setSearchText}
                listening={listening}
                onToggleListening={handleToggleListening}
                onSearch={handleSearch}
            />

            {status === 'idle' && (
                <SuggestChips
                    onSelect={doSearch}
                    recent={recent}
                    onClearRecent={clearRecent}
                />
            )}

            {status === 'loading' && <ResultSkeleton />}

            {status === 'error' && (
                <div className="error-message">{error}</div>
            )}

            {status === 'success' && (
                <SearchResults results={results} onSelectTrack={handleSelectTrack} />
            )}

            <Footer />
        </div>
    );
};

export default App;
