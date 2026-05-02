# Country Code Select Implementation

## Overview
Added country code selection functionality to contact forms to improve international user experience and ensure proper phone number formatting.

## Components Updated

### 1. ReachForm (`components/common/ReachForm/ReachForm.tsx`)
- **Location**: Fixed bottom-right corner form
- **Size**: Small (`sm`) country code selector to fit compact layout
- **Default**: +91 (India)

### 2. LeadForm (`components/common/LeadForm/LeadForm.tsx`)
- **Location**: Modal popup form for course callbacks
- **Size**: Medium (`md`) country code selector for better visibility
- **Default**: +91 (India)

### 3. CountryCodeSelect (`components/common/CountryCodeSelect/CountryCodeSelect.tsx`)
- **Type**: Reusable component
- **Features**: Flag emojis, country codes, responsive sizing
- **Countries**: 25+ major countries including India, US, UK, Australia, etc.

## Features

### Country Code Selection
- **Visual Flags**: Flag emojis for easy country identification
- **Country Codes**: Standard international dialing codes (+91, +1, +44, etc.)
- **Responsive Sizes**: Small, medium, large variants for different use cases
- **Searchable Dropdown**: Easy selection from country list

### Phone Number Handling
- **Automatic Formatting**: Country code + phone number combined automatically
- **Validation**: Uses `tel` input type for better mobile experience
- **Required Field**: Phone number remains mandatory
- **Clean Data**: Sends formatted phone number to API

## Technical Implementation

### Data Structure
```typescript
const countryCodes = [
    { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
    { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
    // ... more countries
];
```

### Component Props
```typescript
interface CountryCodeSelectProps {
    value: string;                    // Selected country code
    onValueChange: (value: string) => void; // Change handler
    className?: string;               // Additional CSS classes
    size?: 'sm' | 'md' | 'lg';      // Size variant
}
```

### Form Integration
```typescript
const [selectedCountryCode, setSelectedCountryCode] = useState('+91');

// In form submission
const phoneWithCountryCode = `${selectedCountryCode} ${data.phone}`;
```

## Usage Examples

### Small Form (ReachForm)
```tsx
<CountryCodeSelect
    value={selectedCountryCode}
    onValueChange={setSelectedCountryCode}
    size="sm"
/>
```

### Medium Form (LeadForm)
```tsx
<CountryCodeSelect
    value={selectedCountryCode}
    onValueChange={setSelectedCountryCode}
    size="md"
/>
```

### Custom Implementation
```tsx
<CountryCodeSelect
    value={countryCode}
    onValueChange={setCountryCode}
    size="lg"
    className="custom-styles"
/>
```

## Supported Countries

### Major Markets
- **India** (+91) - Default selection
- **United States** (+1)
- **United Kingdom** (+44)
- **Australia** (+61)
- **Canada** (+1)

### European Countries
- **Germany** (+49)
- **France** (+33)
- **Russia** (+7)

### Asian Countries
- **China** (+86)
- **Japan** (+81)
- **Singapore** (+65)
- **Malaysia** (+60)
- **Thailand** (+66)
- **Vietnam** (+84)
- **Indonesia** (+62)
- **Philippines** (+63)
- **South Korea** (+82)

### South Asian Countries
- **Pakistan** (+92)
- **Bangladesh** (+880)
- **Sri Lanka** (+94)
- **Nepal** (+977)

### Other Regions
- **Brazil** (+55)
- **South Africa** (+27)
- **UAE** (+971)
- **Hong Kong** (+852)

## Benefits

### User Experience
- **International Friendly**: Supports global users
- **Visual Recognition**: Flag emojis for quick identification
- **Mobile Optimized**: `tel` input type for better mobile keyboards
- **Consistent Formatting**: Standardized phone number format

### Data Quality
- **Proper Formatting**: Country code + phone number
- **Validation Ready**: Structured data for validation
- **API Consistency**: Consistent phone number format in database
- **International Standards**: Follows international dialing conventions

### Maintenance
- **Reusable Component**: Single component for all forms
- **Easy Updates**: Add/remove countries in one place
- **Consistent Styling**: Unified appearance across forms
- **Type Safety**: TypeScript interfaces for better development

## Future Enhancements

### Potential Improvements
- **Auto-detection**: Detect user's country from IP/browser
- **Search Functionality**: Search countries by name
- **Popular Countries**: Show frequently used countries first
- **Validation**: Real-time phone number format validation
- **Formatting**: Auto-format phone numbers based on country

### Additional Features
- **Country Names**: Show full country names in dropdown
- **Regional Grouping**: Group countries by region
- **Custom Defaults**: Different defaults for different forms
- **Accessibility**: Enhanced screen reader support

## Troubleshooting

### Common Issues
- **Missing Flags**: Ensure emoji support in browser/system
- **Dropdown Not Opening**: Check z-index conflicts
- **Form Submission**: Verify phone number concatenation
- **Styling Issues**: Check CSS conflicts with existing styles

### Testing
- **Form Submission**: Test with different country codes
- **Mobile Devices**: Verify mobile keyboard behavior
- **Accessibility**: Test with screen readers
- **Cross-browser**: Test in different browsers