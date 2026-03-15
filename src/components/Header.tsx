import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <div className="title-container noselect">
            <Link to="/" className="title-link">
                <h1 className="title-content">Searics</h1>
            </Link>
            <p className="welcoming-content">
                Search by song, artist, or lyrics
            </p>
        </div>
    );
};

export default Header;
