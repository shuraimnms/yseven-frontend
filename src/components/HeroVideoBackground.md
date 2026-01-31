# HeroVideoBackground Component

A cinematic hero section background video component optimized for performance and accessibility.

## Features

- **Cinematic Experience**: Full-width background video with smooth transitions
- **Performance Optimized**: Lazy loading, proper preloading, and mobile optimizations
- **Accessibility**: Proper ARIA labels, reduced motion support, high contrast mode
- **Responsive**: Works seamlessly across desktop and mobile devices
- **Fallback Support**: Graceful degradation to static image if video fails
- **No Layout Shift**: Prevents CLS (Cumulative Layout Shift) issues

## Usage

```tsx
import HeroVideoBackground from '@/components/HeroVideoBackground';

const HeroSection = () => (
  <section className="relative min-h-screen">
    <HeroVideoBackground />
    <div className="hero-content relative z-10">
      {/* Your hero content here */}
    </div>
  </section>
);
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |

## Technical Details

### Video Attributes
- `autoplay`: Starts playing automatically (muted for browser compliance)
- `muted`: Required for autoplay to work on most browsers
- `loop`: Continuously loops the video
- `playsInline`: Prevents fullscreen on mobile devices
- `preload="auto"`: Preloads video for smooth playback

### Performance Optimizations
- Uses `object-fit: cover` for proper scaling
- Hardware acceleration with `transform: translateZ(0)`
- Smooth opacity transitions for loading states
- Conditional rendering to prevent unnecessary DOM elements

### Accessibility Features
- `aria-hidden="true"` on video element
- Respects `prefers-reduced-motion` setting
- High contrast mode support
- Proper alt text on fallback image

### Browser Support
- Modern browsers with HTML5 video support
- Graceful fallback to static image for older browsers
- Mobile-optimized with proper touch handling

## File Structure

```
src/
├── assets/
│   ├── hero-sauce.mp4    # Main video file
│   └── hero-sauce.jpg    # Fallback poster image
├── components/
│   ├── HeroVideoBackground.tsx
│   └── __tests__/
│       └── HeroVideoBackground.test.tsx
└── index.css             # Video-specific CSS utilities
```

## CSS Classes

The component uses several utility classes defined in `index.css`:

- `.video-background`: Core video styling
- `.video-fade-in`: Smooth opacity transitions
- `.hero-video-container`: Container optimizations
- `.video-overlay`: Text readability overlays

## Mobile Considerations

- Video is scaled slightly on mobile for better performance
- Autoplay may not work on some mobile browsers (graceful fallback)
- Optimized for touch devices with `playsInline`
- Reduced motion support for accessibility

## Performance Tips

1. **Video Optimization**: Ensure the video file is compressed and optimized for web
2. **Poster Image**: Use a high-quality poster image that matches the video's first frame
3. **Preloading**: The component uses `preload="auto"` for immediate playback
4. **Error Handling**: Graceful fallback to static image if video fails to load

## Troubleshooting

### Video Not Playing
- Check browser autoplay policies (video must be muted)
- Verify video file format compatibility (MP4 recommended)
- Ensure video file is accessible from the assets folder

### Performance Issues
- Compress video file size (aim for < 5MB for web)
- Consider using different video formats for different devices
- Monitor Core Web Vitals for layout shift issues

### Mobile Issues
- Test autoplay behavior on actual devices
- Verify `playsInline` attribute is working
- Check video dimensions and aspect ratio