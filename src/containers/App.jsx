import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import SearchButton from '../components/SearchButton';
import ParticlesComponent from '../components/ParticlesComponent';

const App = () => {
    return (
        <div className="App">
            <ParticlesComponent />
            <Header />
            <SearchBox />
            <SearchButton />
        </div>
    );
};

export default App;
