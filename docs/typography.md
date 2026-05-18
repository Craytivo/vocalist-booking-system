# Typography System

This document defines the typography system for the Vocalist Booking System, covering weight, leading, kerning, letter case, hierarchy, usage guidelines, and font pairings.

## Weight Scale

A 5-level weight scale for consistent typography:

| Weight | Value | Usage |
|--------|-------|-------|
| Thin | 100 | Decorative elements, large display text |
| Regular | 400 | Body text, labels, descriptions |
| Medium | 500 | Emphasized text, subheadings |
| Bold | 700 | Headings, important labels, CTAs |
| Black | 900 | Hero titles, major emphasis |

### Visual Examples

```
font-thin (100) - Decorative text
font-regular (400) - Body text and labels
font-medium (500) - Emphasized text
font-bold (700) - Headings and CTAs
font-black (900) - Hero titles
```

## Leading / Line Spacing

Vertical spacing ratios for readability:

| Spacing | Value | Usage |
|---------|-------|-------|
| Tight | 1.1 | Large headings, hero text |
| Normal | 1.5 | Body text, paragraphs |
| Relaxed | 1.75 | Long-form content, descriptions |
| Loose | 2.0 | Lists, stacked elements |

### Visual Examples

```
leading-tight (1.1)
Large headings
with tight spacing

leading-normal (1.5)
Standard body text
with normal line height

leading-relaxed (1.75)
Long-form content
with relaxed spacing
for better readability

leading-loose (2.0)
Lists and stacked
elements with loose
spacing
```

## Kerning / Letter Spacing

Horizontal spacing rules:

| Spacing | Value | Usage |
|---------|-------|-------|
| Tight | -0.02em | Large display text |
| Normal | 0 | Body text, most content |
| Wide | 0.05em | Uppercase text, labels |
| Extra Wide | 0.15em | Small uppercase text, buttons |
| Ultra Wide | 0.3em | Decorative elements |

### Visual Examples

```
tracking-tight (-0.02em) - Large display text
tracking-normal (0) - Body text
tracking-wide (0.05em) - UPPERCASE LABELS
tracking-extra (0.15em) - BUTTONS
tracking-ultra (0.3em) - DECORATIVE
```

## Letter Case Guidelines

Case usage patterns:

| Case | Usage | Example |
|------|-------|---------|
| Uppercase | Navigation, buttons, labels, badges | QUICK ACTIONS |
| Sentence case | Headings, subheadings | Vocal performance agreement |
| Lowercase | Tags, decorative text | draft |
| Title Case | Page titles, section headers | Contract Preview |
| Mixed Case | Body text, descriptions | The contract is ready for review |

### Visual Examples

```
UPPERCASE - Navigation, buttons, labels
Sentence case - Headings, subheadings
lowercase - Tags, decorative text
Title Case - Page titles, section headers
Mixed Case - Body text, descriptions
```

## Typography Hierarchy

6-level hierarchy system:

| Level | Size | Weight | Leading | Tracking | Usage |
|-------|------|--------|---------|----------|-------|
| H1 (Hero) | 64px | Black | Tight | Tight | Hero titles, major emphasis |
| H2 (Page Title) | 40px | Bold | Normal | Normal | Page titles |
| H3 (Section Header) | 28px | Medium | Normal | Normal | Section headers |
| H4 (Subsection) | 20px | Medium | Normal | Normal | Subsection headers |
| Body | 16px | Regular | Relaxed | Normal | Paragraphs, body text |
| Small (Caption) | 14px | Regular | Relaxed | Wide | Captions, small labels |

### Visual Examples

```
H1 (Hero) - 64px, Black, Tight leading, Tight tracking
Vocal Performance Agreement

H2 (Page Title) - 40px, Bold, Normal leading, Normal tracking
Contract Preview

H3 (Section Header) - 28px, Medium, Normal leading, Normal tracking
Artist Information

H4 (Subsection) - 20px, Medium, Normal leading, Normal tracking
Contact Details

Body - 16px, Regular, Relaxed leading, Normal tracking
The contract is ready for review and signature.

Small (Caption) - 14px, Regular, Relaxed leading, Wide tracking
LAST UPDATED: JAN 15, 2025
```

## Usage Guidelines (Do's and Don'ts)

### Do's

✓ Use Black weight only for hero-level emphasis  
✓ Apply wide letter spacing to uppercase text under 14px  
✓ Use relaxed leading for text blocks over 3 lines  
✓ Maintain consistent hierarchy within sections  
✓ Use Medium weight for emphasis without full bold  
✓ Use Tight leading for large headings only  
✓ Apply Normal tracking to body text  
✓ Use Bold weight for buttons and CTAs  

### Don'ts

✗ Don't use Thin weight for body text (legibility issues)  
✗ Don't apply tight leading to multi-line text  
✗ Don't mix more than 2 weights in a single component  
✗ Don't use uppercase for long text blocks  
✗ Don't use Black weight for buttons (use Bold instead)  
✗ Don't use Ultra Wide tracking for body text  
✗ Don't mix more than 3 font families in a single view  
✗ Don't use Loose leading for single-line text  

### Visual Examples

#### Correct Usage
```
✓ Hero title with Black weight and Tight leading
✓ Body text with Regular weight and Relaxed leading
✓ Uppercase buttons with Bold weight and Extra Wide tracking
✓ Section headers with Medium weight and Normal leading
```

#### Incorrect Usage
```
✗ Body text with Thin weight (hard to read)
✗ Multi-line text with Tight leading (cramped)
✗ Button with Black weight (too heavy)
✗ Long paragraph in uppercase (hard to read)
```

## Font Pairings

### Primary Pairing
- **Body**: Inter
- **Headings**: Space Grotesk
- **Usage**: Main application interface, forms, dashboards

### Secondary Pairing
- **Body**: Inter
- **Hero**: Playfair Display
- **Usage**: Landing pages, marketing materials, hero sections

### Monospace Pairing
- **Body**: Inter
- **Code/Technical**: JetBrains Mono
- **Usage**: Code blocks, technical documentation, data displays

### Accent Pairing
- **Body**: Inter
- **Quotes/Legal**: Instrument Serif
- **Usage**: Contract preview, quotes, legal text

### Visual Examples

```
Primary Pairing:
Space Grotesk (Headings) + Inter (Body)

Secondary Pairing:
Playfair Display (Hero) + Inter (Body)

Monospace Pairing:
Inter (Body) + JetBrains Mono (Code)

Accent Pairing:
Inter (Body) + Instrument Serif (Quotes)
```

## Tailwind Utility Classes

### Font Weights
- `font-thin` - Weight 100
- `font-regular` - Weight 400
- `font-medium` - Weight 500
- `font-bold` - Weight 700
- `font-black` - Weight 900

### Line Heights
- `leading-tight` - 1.1
- `leading-normal` - 1.5
- `leading-relaxed` - 1.75
- `leading-loose` - 2.0

### Letter Spacing
- `tracking-tight` - -0.02em
- `tracking-normal` - 0
- `tracking-wide` - 0.05em
- `tracking-extra` - 0.15em
- `tracking-ultra` - 0.3em

### Font Sizes
- `text-hero` - 64px hero text
- `text-page-title` - 40px page titles
- `text-section-header` - 28px section headers
- `text-subsection` - 20px subsections
- `text-body` - 16px body text
- `text-caption` - 14px captions

### Font Families
- `font-sans` - Inter (default)
- `font-display` - Space Grotesk
- `font-serif` - Playfair Display
- `font-mono` - JetBrains Mono
- `font-accent` - Instrument Serif

## Usage Patterns by Component Type

### Headers
- Use `font-display` for main navigation and branding
- Use `font-black` with `text-hero` for hero titles
- Use `font-bold` with `text-page-title` for page titles

### Forms
- Use `font-sans` for all form elements
- Use `font-medium` for field labels
- Use `font-regular` for placeholders and help text
- Use `leading-relaxed` for multi-line text areas

### Buttons
- Use `font-bold` for button text
- Use `tracking-extra` for uppercase buttons
- Use `font-sans` for consistency

### Modals
- Use `font-bold` with `text-page-title` for modal titles
- Use `font-regular` with `text-body` for modal content
- Use `font-medium` for action buttons

### Contract Preview
- Use `font-accent` for legal text and quotes
- Use `font-serif` for formal sections
- Use `leading-relaxed` for contract paragraphs

## Implementation Checklist

- [x] Define weight scale in Tailwind config
- [x] Establish leading/line spacing system
- [x] Define kerning/letter spacing rules
- [x] Add font family configurations
- [x] Create typography hierarchy utilities
- [x] Write comprehensive documentation
- [ ] Apply typography system to header
- [ ] Apply typography system to form sections
- [ ] Apply typography system to buttons
- [ ] Apply typography system to contract preview
- [ ] Apply typography system to modals
- [ ] Test typography across different screen sizes
