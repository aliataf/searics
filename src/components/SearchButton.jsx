import './SearchButton.css';

const SearchButton = () => {
    const search = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="search-button noselect" onClick={search}>
            Search
        </div>
    );
};

export default SearchButton;
