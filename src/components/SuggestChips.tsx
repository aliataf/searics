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
    recent?: string[];
    onClearRecent?: () => void;
}

const SuggestChips = ({ onSelect, recent = [], onClearRecent }: SuggestChipsProps) => {
    return (
        <div className="chips-container">
            {recent.length > 0 && (
                <div className="chips-section">
                    <div className="chips-header">
                        <span className="chips-label">Recent searches</span>
                        {onClearRecent && (
                            <button className="chips-clear" onClick={onClearRecent}>Clear</button>
                        )}
                    </div>
                    <div className="chips-list">
                        {recent.map((s) => (
                            <button key={s} className="chip" onClick={() => onSelect(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            <div className="chips-section">
                <span className="chips-label">Popular</span>
                <div className="chips-list">
                    {SUGGESTIONS.map((s) => (
                        <button key={s} className="chip" onClick={() => onSelect(s)}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SuggestChips;
