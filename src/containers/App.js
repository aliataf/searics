import React, { Component } from 'react';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <SearchBox />
            </div>
        );
    }
}

export default App;
