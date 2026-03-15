import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <p>
                Powered by{' '}
                <a href="https://lrclib.net" target="_blank" rel="noopener noreferrer">LRCLIB</a>
                {' '}&{' '}
                <a href="https://lyrics.ovh" target="_blank" rel="noopener noreferrer">lyrics.ovh</a>
            </p>
            <p className="footer-hint">
                Press <kbd>/</kbd> to search
            </p>
        </footer>
    );
};

export default Footer;
