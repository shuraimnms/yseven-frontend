# Y7 Ultra-Premium Typography System

## 🎯 Brand Typography Philosophy
**Ultra-premium • Bold • Iconic • Global • Cinematic • High-end • Conversion-focused**

The Y7 typography system embodies the essence of luxury FMCG branding, combining the sophistication of Apple, the cinematic impact of Netflix, the elegance of Michelin-star dining, and the power of Ferrari branding.

## 🔤 Font Stack

### 1️⃣ PRIMARY DISPLAY FONT - Playfair Display
**Usage:** Headlines, Hero Text, Product Titles, Section Titles
- **Emotion:** Authority, Luxury, Cinematic Impact
- **Weights:** 400, 500, 600, 700, 800, 900
- **Fallbacks:** Georgia, Times New Roman, serif

### 2️⃣ SECONDARY BODY FONT - Montserrat
**Usage:** Body Text, UI Elements, Navigation, Buttons, Forms
- **Emotion:** Clarity, Trust, Modern Premium
- **Weights:** 300, 400, 500, 600, 700, 800, 900
- **Fallbacks:** -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif

## 📏 Typography Hierarchy

### Hero Level (H1)
```css
.text-hero {
  font-family: 'Playfair Display';
  font-size: clamp(2.25rem, 8vw, 6rem); /* 36px - 96px */
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 0.04em;
  color: hsl(var(--cream));
}
```

### Section Title (H2)
```css
.text-section-title {
  font-family: 'Playfair Display';
  font-size: clamp(1.75rem, 5vw, 3.5rem); /* 28px - 56px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.03em;
  color: hsl(var(--cream));
}
```

### Product Title (H3)
```css
.text-product-title {
  font-family: 'Playfair Display';
  font-size: clamp(1.5rem, 4vw, 2.25rem); /* 24px - 36px */
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: 0.02em;
  color: hsl(var(--cream));
}
```

### Hero Subtitle
```css
.text-hero-sub {
  font-family: 'Montserrat';
  font-size: clamp(1.125rem, 2.5vw, 1.25rem); /* 18px - 20px */
  font-weight: 500;
  line-height: 1.6;
  letter-spacing: 0.01em;
  color: hsl(var(--cream) / 0.8);
}
```

### Body Text - Premium
```css
.text-body-premium {
  font-family: 'Montserrat';
  font-size: clamp(1rem, 2vw, 1.125rem); /* 16px - 18px */
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0.005em;
  color: hsl(var(--cream) / 0.85);
  max-width: 70ch;
}
```

### Body Text - Large
```css
.text-body-large {
  font-family: 'Montserrat';
  font-size: clamp(1.125rem, 2.5vw, 1.25rem); /* 18px - 20px */
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0.005em;
  color: hsl(var(--cream) / 0.85);
}
```

### Caption/Label Text
```css
.text-caption {
  font-family: 'Montserrat';
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: hsl(var(--gold));
}
```

### CTA Button Text
```css
.text-cta {
  font-family: 'Montserrat';
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  font-size: 0.875rem; /* 14px */
}
```

### Navigation Text
```css
.text-nav {
  font-family: 'Montserrat';
  font-weight: 500;
  letter-spacing: 0.01em;
  font-size: 0.875rem; /* 14px */
}
```

### Quote Text
```css
.text-quote {
  font-family: 'Playfair Display';
  font-size: clamp(1.25rem, 3vw, 1.75rem); /* 20px - 28px */
  font-weight: 500;
  font-style: italic;
  line-height: 1.4;
  letter-spacing: 0.01em;
  color: hsl(var(--cream) / 0.9);
}
```

## 🎨 Utility Classes

### Font Families
- `.font-display` - Playfair Display
- `.font-body` - Montserrat
- `.font-sans` - Montserrat (alias)
- `.font-serif` - Playfair Display (alias)

### Font Weights
- `.font-ultra-bold` - 900
- `.font-extra-bold` - 800
- `.font-display-bold` - 700
- `.font-display-medium` - 600
- `.font-body-bold` - 700
- `.font-body-semibold` - 600
- `.font-body-medium` - 500

### Letter Spacing
- `.tracking-cinematic` - 0.04em (Hero headlines)
- `.tracking-elegant` - 0.02em (Section titles)
- `.tracking-refined` - 0.01em (Body text)
- `.tracking-luxury` - 0.2em (Special emphasis)
- `.tracking-wide-luxury` - 0.3em (Ultra-wide spacing)

### Line Heights
- `.leading-cinematic` - 1.1 (Hero text)
- `.leading-display` - 1.2 (Section titles)
- `.leading-title` - 1.25 (Product titles)
- `.leading-body-premium` - 1.7 (Body text)
- `.leading-body-comfortable` - 1.8 (Comfortable reading)

### Responsive Font Sizes
- `.text-responsive-hero` - clamp(2.25rem, 8vw, 6rem)
- `.text-responsive-title` - clamp(1.75rem, 5vw, 3.5rem)
- `.text-responsive-subtitle` - clamp(1.5rem, 4vw, 2.25rem)
- `.text-responsive-body` - clamp(1rem, 2vw, 1.125rem)

## 🏆 Implementation Examples

### Homepage Hero
```jsx
<section className="hero-section">
  <p className="text-caption mb-6">Y7 Premium Sauces</p>
  <h1 className="text-hero text-gradient-gold mb-6">
    One Brand. <span className="text-gradient-gold">Endless Flavor.</span>
  </h1>
  <p className="text-hero-sub max-w-2xl mx-auto">
    Discover our comprehensive range of premium sauces and condiments.
  </p>
</section>
```

### Product Section
```jsx
<section className="product-section">
  <p className="text-caption mb-4">Y7 Product Catalog</p>
  <h2 className="text-section-title mb-6">
    Master <span className="text-gradient-gold">Product Range</span>
  </h2>
  <div className="product-card">
    <h3 className="text-product-title mb-4">Tomato Ketchup</h3>
    <p className="text-body-premium mb-6">
      Classic tomato ketchup made from ripe, high-quality tomatoes.
    </p>
  </div>
</section>
```

### Testimonials
```jsx
<section className="testimonials">
  <h2 className="text-section-title mb-16">
    Loved by <span className="text-gradient-gold">Chefs Worldwide</span>
  </h2>
  <blockquote className="text-quote mb-8">
    "Y7 sauces have become an essential part of my kitchen."
  </blockquote>
  <cite className="font-display font-display-medium">Chef Marcus Reynolds</cite>
</section>
```

### CTA Buttons
```jsx
<Button className="text-cta bg-gold text-obsidian hover:bg-gold/90">
  Request B2B Pricing
</Button>
```

## 🚫 Typography Don'ts

❌ **Never Use:**
- Comic Sans, Pacifico, Lobster
- Default system fonts as primary brand fonts
- Thin/ultra-light weights (below 400)
- Over-decorated or script fonts
- Mixed random fonts
- Condensed fonts for body text

❌ **Avoid:**
- Tight kerning that reduces readability
- All caps for long text blocks
- More than 3 font weights per page
- Inconsistent letter spacing
- Line lengths over 75 characters

## ✅ Typography Best Practices

✅ **Always:**
- Use consistent letter spacing throughout
- Maintain proper contrast ratios
- Test on multiple devices and screen sizes
- Use semantic HTML elements (h1, h2, p, etc.)
- Implement proper font loading strategies

✅ **Optimize for:**
- Readability at all screen sizes
- Fast font loading with font-display: swap
- Accessibility with proper heading hierarchy
- SEO with semantic markup
- Performance with font subsetting

## 🎯 Brand Applications

### Digital Applications
- Website headers and hero sections
- Product pages and catalogs
- Blog posts and articles
- Email campaigns
- Social media graphics

### Print Applications
- Packaging design
- Marketing materials
- Business cards
- Brochures and catalogs
- Point-of-sale materials

### Advertising
- Digital ads and banners
- Print advertisements
- Outdoor advertising
- Video overlays
- Presentation materials

## 📱 Mobile Optimization

The typography system uses `clamp()` functions for responsive scaling:
- Minimum size for mobile devices
- Preferred size using viewport units
- Maximum size for large screens

This ensures optimal readability across all devices while maintaining the premium brand feel.

## 🔧 Technical Implementation

### CSS Custom Properties
All typography values are defined using CSS custom properties for easy maintenance and theming.

### Font Loading Strategy
- Uses `font-display: swap` for optimal performance
- Implements font preloading for critical fonts
- Provides fallback fonts for graceful degradation

### Accessibility
- Maintains WCAG AA contrast ratios
- Uses semantic HTML structure
- Supports screen readers with proper markup
- Respects user preferences for reduced motion

---

**The Y7 typography system is designed to feel like a $100M global sauce brand - premium, authoritative, and conversion-optimized.**