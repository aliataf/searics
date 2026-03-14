import './SearchButton.css';

const SearchButton = ({ searchText, onSearch }) => {
    return (
        <button
            className={`search-button noselect ${!searchText.trim() ? 'disabled' : ''}`}
            onClick={onSearch}
            disabled={!searchText.trim()}
        >
            Search
        </button>
    );
};

export default SearchButton;
