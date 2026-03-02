import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App';

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

describe('App', () => {
  it('shows ModeSelector when no mode is stored', () => {
    render(<App />);
    expect(screen.getByText('Student Mode')).toBeInTheDocument();
    expect(screen.getByText('Mentor Mode')).toBeInTheDocument();
  });

  it('enters student mode when Student Mode is clicked', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Student Mode'));
    expect(screen.getByText(/Basketball Shot Tracker/i)).toBeInTheDocument();
    expect(screen.queryByText('Mentor Mode')).not.toBeInTheDocument();
  });

  it('enters mentor mode when Mentor Mode is clicked', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Mentor Mode'));
    expect(screen.getByText(/Mentor Dashboard/i)).toBeInTheDocument();
  });

  it('shows Court, Stats, History tabs in student mode', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Student Mode'));
    expect(screen.getByText(/Court/i)).toBeInTheDocument();
    expect(screen.getByText(/Stats/i)).toBeInTheDocument();
    expect(screen.getByText(/History/i)).toBeInTheDocument();
  });

  it('shows Stats and History tabs (no Court tab) in mentor mode', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Mentor Mode'));
    expect(screen.queryByRole('button', { name: /Court/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Stats/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /History/i })).toBeInTheDocument();
  });

  it('switches to Stats tab when Stats is clicked', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Student Mode'));
    await userEvent.click(screen.getByText(/Stats/i));
    expect(screen.getByText(/Overall Stats/i)).toBeInTheDocument();
  });

  it('switches to History tab when History is clicked', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Student Mode'));
    await userEvent.click(screen.getByText(/History/i));
    expect(screen.getByText(/No shots recorded yet/i)).toBeInTheDocument();
  });

  it('returns to ModeSelector when Switch Mode is clicked', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Student Mode'));
    await userEvent.click(screen.getByText('Switch Mode'));
    expect(screen.getByText('Student Mode')).toBeInTheDocument();
    expect(screen.getByText('Mentor Mode')).toBeInTheDocument();
  });

  it('restores mode from localStorage on mount', () => {
    localStorage.setItem('appMode', 'mentor');
    render(<App />);
    expect(screen.getByText(/Mentor Dashboard/i)).toBeInTheDocument();
  });
});
