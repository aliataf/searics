import React, { Component } from 'react';
import './SearchBox.css';

class SearchBox extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            micOn:  './images/mic-animate.gif',
            micOff: './images/mic.gif',
            noMic:  './images/mic-slash.gif',
        }
    }

    componentDidMount() {
        this.micImg.draggable = false;
        setTimeout(() => this.searchContainerInput.focus(), 0);
    }

    focusInput = () => {
        this.searchContainer.classList.add('focusInput');
    }

    blurInput = () => {
        this.searchContainer.classList.remove('focusInput');
    }

    focusMic = () => {
        this.searchContainer.classList.add('focusInput');
        this.micImg.src = this.state.micOn;
    }

    blurMic = () => {
        this.searchContainer.classList.remove('focusInput');
        this.micImg.src = this.state.micOff;
    }

    render() {
        return (
            <div className="search-container" ref={ref => this.searchContainer = ref}>
                <div className="search-text">
                    <form>
                        <textarea id="searchBox" placeholder="Type the lyrics" ref={ref => this.searchContainerInput = ref} onFocus={this.focusInput} onBlur={this.blurInput}></textarea>
                    </form>
                </div>
                <div className="microphone">
                    <img src={this.state.micOff} className="microphone-img" alt="Microphone" ref={ref => this.micImg = ref} tabIndex="0" onFocus={this.focusMic} onBlur={this.blurMic} />
                </div>
            </div>
        );
    }
}

export default SearchBox;