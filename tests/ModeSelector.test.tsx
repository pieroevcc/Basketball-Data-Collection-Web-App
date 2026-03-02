import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModeSelector from '../src/components/ModeSelector';

describe('ModeSelector', () => {
  it('renders the app title', () => {
    render(<ModeSelector onModeSelect={vi.fn()} />);
    expect(screen.getByText(/Basketball Shot Tracker/i)).toBeInTheDocument();
  });

  it('renders Student Mode button', () => {
    render(<ModeSelector onModeSelect={vi.fn()} />);
    expect(screen.getByText('Student Mode')).toBeInTheDocument();
  });

  it('renders Mentor Mode button', () => {
    render(<ModeSelector onModeSelect={vi.fn()} />);
    expect(screen.getByText('Mentor Mode')).toBeInTheDocument();
  });

  it('calls onModeSelect with "student" when Student Mode is clicked', async () => {
    const onModeSelect = vi.fn();
    render(<ModeSelector onModeSelect={onModeSelect} />);
    await userEvent.click(screen.getByText('Student Mode'));
    expect(onModeSelect).toHaveBeenCalledWith('student');
  });

  it('calls onModeSelect with "mentor" when Mentor Mode is clicked', async () => {
    const onModeSelect = vi.fn();
    render(<ModeSelector onModeSelect={onModeSelect} />);
    await userEvent.click(screen.getByText('Mentor Mode'));
    expect(onModeSelect).toHaveBeenCalledWith('mentor');
  });
});
