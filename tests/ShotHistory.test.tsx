import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ShotHistory from '../src/components/ShotHistory';
import { Shot } from '../src/types';

const makeShot = (id: string, zone: string, made: boolean): Shot => ({
  id,
  x: 250,
  y: 95,
  made,
  timestamp: Date.now(),
  zone,
});

describe('ShotHistory', () => {
  it('shows empty state message when no shots recorded', () => {
    render(<ShotHistory shots={[]} onClear={vi.fn()} />);
    expect(screen.getByText(/No shots recorded yet/i)).toBeInTheDocument();
  });

  it('does not show Clear All button when shots list is empty', () => {
    render(<ShotHistory shots={[]} onClear={vi.fn()} />);
    expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
  });

  it('shows Clear All button when shots exist', () => {
    const shots = [makeShot('1', 'Zone 1: Paint', true)];
    render(<ShotHistory shots={shots} onClear={vi.fn()} />);
    expect(screen.getByText('Clear All')).toBeInTheDocument();
  });

  it('calls onClear when Clear All is clicked', async () => {
    const onClear = vi.fn();
    const shots = [makeShot('1', 'Zone 1: Paint', true)];
    render(<ShotHistory shots={shots} onClear={onClear} />);
    await userEvent.click(screen.getByText('Clear All'));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('renders zone name for each shot', () => {
    const shots = [makeShot('1', 'Zone 1: Paint', true)];
    render(<ShotHistory shots={shots} onClear={vi.fn()} />);
    expect(screen.getByText('Zone 1: Paint')).toBeInTheDocument();
  });

  it('shows Made label for a made shot', () => {
    const shots = [makeShot('1', 'Zone 1: Paint', true)];
    render(<ShotHistory shots={shots} onClear={vi.fn()} />);
    expect(screen.getByText(/Made/i)).toBeInTheDocument();
  });

  it('shows Missed label for a missed shot', () => {
    const shots = [makeShot('1', 'Zone 1: Paint', false)];
    render(<ShotHistory shots={shots} onClear={vi.fn()} />);
    expect(screen.getByText(/Missed/i)).toBeInTheDocument();
  });

  it('displays total shot count in footer', () => {
    const shots = [makeShot('1', 'Zone 1: Paint', true), makeShot('2', 'Zone 2: Left Mid-Range', false)];
    render(<ShotHistory shots={shots} onClear={vi.fn()} />);
    expect(screen.getByText(/Total Shots: 2/i)).toBeInTheDocument();
  });

  it('only shows up to 10 most recent shots', () => {
    const shots = Array.from({ length: 15 }, (_, i) =>
      makeShot(`shot-${i}`, 'Zone 1: Paint', i % 2 === 0)
    );
    render(<ShotHistory shots={shots} onClear={vi.fn()} />);
    const items = screen.getAllByText('Zone 1: Paint');
    expect(items).toHaveLength(10);
  });

  it('displays the most recent shot first (reverse order)', () => {
    const shots = [
      makeShot('1', 'Zone 1: Paint', true),
      makeShot('2', 'Zone 2: Left Mid-Range', false),
    ];
    render(<ShotHistory shots={shots} onClear={vi.fn()} />);
    const zones = screen.getAllByText(/Zone \d/);
    expect(zones[0].textContent).toBe('Zone 2: Left Mid-Range');
    expect(zones[1].textContent).toBe('Zone 1: Paint');
  });
});
