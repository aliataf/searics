import { useState, useCallback } from 'react';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import SearchButton from '../components/SearchButton';
import ParticlesComponent from '../components/ParticlesComponent';

const App = () => {
    const [searchText, setSearchText] = useState('');
    const [listening, setListening] = useState(false);

    const handleToggleListening = useCallback((value) => {
        setListening(value);
    }, []);

    return (
        <div className="App">
            <ParticlesComponent />
            <Header />
            <SearchBox
                searchText={searchText}
                onSearchTextChange={setSearchText}
                listening={listening}
                onToggleListening={handleToggleListening}
            />
            <SearchButton searchText={searchText} />
        </div>
    );
};

export default App;
