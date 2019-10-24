import React, { Component } from 'react';
import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import Particles from 'react-particles-js';

const particleOpt = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <Particles 
                    params={particleOpt}
                />
                <Header />
                <SearchBox />
            </div>
        );
    }
}

export default App;
