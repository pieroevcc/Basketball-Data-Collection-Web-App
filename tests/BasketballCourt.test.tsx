import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BasketballCourt from '../src/components/BasketballCourt';
import { Shot } from '../src/types';

const makeShot = (id: string, zone: string, made: boolean, x = 250, y = 95): Shot => ({
  id,
  x,
  y,
  made,
  timestamp: Date.now(),
  zone,
});

describe('BasketballCourt', () => {
  it('renders the SVG court', () => {
    const { container } = render(<BasketballCourt onShotRecorded={vi.fn()} shots={[]} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not show shot buttons initially', () => {
    render(<BasketballCourt onShotRecorded={vi.fn()} shots={[]} />);
    expect(screen.queryByText(/Made/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Missed/i)).not.toBeInTheDocument();
  });

  it('renders a circle marker for each shot', () => {
    const shots = [
      makeShot('1', 'Zone 1: Paint', true, 250, 95),
      makeShot('2', 'Zone 2: Left Mid-Range', false, 125, 240),
    ];
    const { container } = render(<BasketballCourt onShotRecorded={vi.fn()} shots={shots} />);
    // Shot markers are circles; count those with fill of green or red
    const markers = container.querySelectorAll('circle[fill="#00ff00"], circle[fill="#ff0000"]');
    expect(markers).toHaveLength(2);
  });

  it('colors made shot markers green', () => {
    const shots = [makeShot('1', 'Zone 1: Paint', true, 250, 95)];
    const { container } = render(<BasketballCourt onShotRecorded={vi.fn()} shots={shots} />);
    const greenMarker = container.querySelector('circle[fill="#00ff00"]');
    expect(greenMarker).toBeInTheDocument();
  });

  it('colors missed shot markers red', () => {
    const shots = [makeShot('1', 'Zone 1: Paint', false, 250, 95)];
    const { container } = render(<BasketballCourt onShotRecorded={vi.fn()} shots={shots} />);
    const redMarker = container.querySelector('circle[fill="#ff0000"]');
    expect(redMarker).toBeInTheDocument();
  });

  it('shows Made, Missed, Cancel buttons after clicking a valid zone', () => {
    const { container } = render(<BasketballCourt onShotRecorded={vi.fn()} shots={[]} />);
    const svg = container.querySelector('svg')!;

    // Mock getBoundingClientRect so coordinate math maps to Zone 1: Paint (x=250, y=95)
    svg.getBoundingClientRect = () => ({
      left: 0, top: 0, width: 500, height: 470,
      right: 500, bottom: 470, x: 0, y: 0, toJSON: () => {},
    });

    fireEvent.click(svg, { clientX: 250, clientY: 95 });

    expect(screen.getByText(/Made/i)).toBeInTheDocument();
    expect(screen.getByText(/Missed/i)).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onShotRecorded with made=true when Made is clicked', async () => {
    const onShotRecorded = vi.fn();
    const { container } = render(<BasketballCourt onShotRecorded={onShotRecorded} shots={[]} />);
    const svg = container.querySelector('svg')!;

    svg.getBoundingClientRect = () => ({
      left: 0, top: 0, width: 500, height: 470,
      right: 500, bottom: 470, x: 0, y: 0, toJSON: () => {},
    });

    fireEvent.click(svg, { clientX: 250, clientY: 95 });
    await userEvent.click(screen.getByText(/Made/i));

    expect(onShotRecorded).toHaveBeenCalledOnce();
    const [shot] = onShotRecorded.mock.calls[0];
    expect(shot.made).toBe(true);
    expect(shot.zone).toBe('Zone 1: Paint');
  });

  it('calls onShotRecorded with made=false when Missed is clicked', async () => {
    const onShotRecorded = vi.fn();
    const { container } = render(<BasketballCourt onShotRecorded={onShotRecorded} shots={[]} />);
    const svg = container.querySelector('svg')!;

    svg.getBoundingClientRect = () => ({
      left: 0, top: 0, width: 500, height: 470,
      right: 500, bottom: 470, x: 0, y: 0, toJSON: () => {},
    });

    fireEvent.click(svg, { clientX: 250, clientY: 95 });
    await userEvent.click(screen.getByText(/Missed/i));

    expect(onShotRecorded).toHaveBeenCalledOnce();
    const [shot] = onShotRecorded.mock.calls[0];
    expect(shot.made).toBe(false);
  });

  it('hides shot buttons after Cancel is clicked', async () => {
    const { container } = render(<BasketballCourt onShotRecorded={vi.fn()} shots={[]} />);
    const svg = container.querySelector('svg')!;

    svg.getBoundingClientRect = () => ({
      left: 0, top: 0, width: 500, height: 470,
      right: 500, bottom: 470, x: 0, y: 0, toJSON: () => {},
    });

    fireEvent.click(svg, { clientX: 250, clientY: 95 });
    await userEvent.click(screen.getByText('Cancel'));

    expect(screen.queryByText(/Made/i)).not.toBeInTheDocument();
  });
});
