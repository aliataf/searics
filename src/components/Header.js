import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className="title-container noselect">
            <div className="title-content">
                Searics
            </div>
            <div className="welcoming-container">
                <div className="welcoming-content green">
                    Search your favourite lyrics by
                    <span className="purp"> typing</span> or
                    <span className="purp"> speaking</span>
                </div>
            </div>
        </div>
    );
}

export default Header;