import './SearchButton.css';

const SearchButton = ({ searchText }) => {
    const search = () => {
        if (!searchText.trim()) return;
        console.log('Searching for:', searchText);
    };

    return (
        <button
            className={`search-button noselect ${!searchText.trim() ? 'disabled' : ''}`}
            onClick={search}
            disabled={!searchText.trim()}
        >
            Search
        </button>
    );
};

export default SearchButton;
