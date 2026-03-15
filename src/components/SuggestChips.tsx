import './SuggestChips.css';

const SUGGESTIONS = [
    'Bohemian Rhapsody',
    'Shape of You',
    'Blinding Lights',
    'Yesterday',
    'Hotel California',
    'Rolling in the Deep',
];

interface SuggestChipsProps {
    onSelect: (query: string) => void;
}

const SuggestChips = ({ onSelect }: SuggestChipsProps) => {
    return (
        <div className="chips-container">
            <span className="chips-label">Try searching for:</span>
            <div className="chips-list">
                {SUGGESTIONS.map((s) => (
                    <button
                        key={s}
                        className="chip"
                        onClick={() => onSelect(s)}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SuggestChips;
