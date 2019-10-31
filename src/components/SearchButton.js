import React, { Component } from 'react';
import './SearchButton.css';

class SearchButton extends Component {
    state = {  }
    search(e) {
        e.stopPropagation();
    }
    render() { 
        return (
            <div className="search-button noselect" ref={ref => this.searchButton = ref} onClick={this.search}>
                Search
            </div>
        );
    }
}

export default SearchButton;