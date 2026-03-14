import './SearchButton.css';

interface SearchButtonProps {
    searchText: string;
    onSearch: () => void;
}

const SearchButton = ({ searchText, onSearch }: SearchButtonProps) => {
    return (
        <button
            className="search-button noselect"
            onClick={onSearch}
            disabled={!searchText.trim()}
        >
            Search
        </button>
    );
};

export default SearchButton;
