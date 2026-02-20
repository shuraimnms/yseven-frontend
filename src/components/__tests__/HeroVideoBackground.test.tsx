import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroVideoBackground from '../HeroVideoBackground';

// Mock the video and image imports
vi.mock('@/assets/hero-sauce.jpg', () => ({
  default: 'mock-image.jpg'
}));

vi.mock('@/assets/hero-sauce.jpg', () => ({
  default: 'mock-image.jpg'
}));

describe('HeroVideoBackground', () => {
  it('renders video element with correct attributes', () => {
    render(<HeroVideoBackground />);
    
    const video = screen.getByRole('presentation', { hidden: true });
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('muted');
    expect(video).toHaveAttribute('loop');
    expect(video).toHaveAttribute('playsinline');
    expect(video).toHaveAttribute('preload', 'auto');
  });

  it('renders fallback image', () => {
    render(<HeroVideoBackground />);
    
    const image = screen.getByAltText('Y7 Premium Sauce Hero Background');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('applies custom className', () => {
    const { container } = render(<HeroVideoBackground className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has proper overlay elements for text readability', () => {
    const { container } = render(<HeroVideoBackground />);
    
    const overlays = container.querySelectorAll('.video-overlay');
    expect(overlays).toHaveLength(2);
  });
});