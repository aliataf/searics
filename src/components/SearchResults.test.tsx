import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchResults from './SearchResults';
import type { SuggestTrack } from '../types';

const mockTrack: SuggestTrack = {
    id: 1,
    title: 'Bohemian Rhapsody (Remastered)',
    title_short: 'Bohemian Rhapsody',
    duration: 354,
    artist: { name: 'Queen', picture_medium: 'https://example.com/queen.jpg' },
    album: { title: 'A Night at the Opera', cover_medium: 'https://example.com/album.jpg' },
};

describe('SearchResults', () => {
    it('shows empty message when no results', () => {
        render(<SearchResults results={[]} onSelectTrack={() => {}} />);
        expect(screen.getByText('No songs found. Try a different search.')).toBeInTheDocument();
    });

    it('renders track cards', () => {
        render(<SearchResults results={[mockTrack]} onSelectTrack={() => {}} />);
        expect(screen.getByText('Bohemian Rhapsody')).toBeInTheDocument();
        expect(screen.getByText('Queen')).toBeInTheDocument();
        expect(screen.getByText('A Night at the Opera')).toBeInTheDocument();
        expect(screen.getByText('5:54')).toBeInTheDocument();
    });

    it('calls onSelectTrack when a card is clicked', async () => {
        const onSelect = vi.fn();
        render(<SearchResults results={[mockTrack]} onSelectTrack={onSelect} />);

        await userEvent.click(screen.getByText('Bohemian Rhapsody'));
        expect(onSelect).toHaveBeenCalledWith(mockTrack);
    });
});
