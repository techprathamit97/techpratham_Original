# Phone Input Implementation

## Overview
Replaced `react-phone-input-2` package with a custom PhoneInput component that provides better validation, prevents country code deletion, and ensures proper phone number formatting per country. Now includes actual country flag images for better visual identification.

## Features
- **Country Code Protection**: Users cannot delete or modify the country code
- **Country-Specific Validation**: Phone numbers are validated based on the selected country's rules
- **Real-time Validation**: Shows validation messages and success indicators
- **Proper Formatting**: Automatically formats phone numbers correctly
- **Comprehensive Country Support**: Supports 30+ countries with proper validation rules
- **Flag Display**: Shows actual country flags using flagcdn.com with emoji fallback
- **Error Handling**: Graceful fallback to emoji flags if images fail to load

## Components Used
- **PhoneInput**: Custom component with country code protection and validation
- **CountryCodeSelect**: Dropdown for selecting country codes with flag images and indicators

## Flag Implementation
- **Primary**: High-quality flag images from flagcdn.com
- **Fallback**: Emoji flags if images fail to load
- **Responsive**: Different flag sizes for different component sizes (sm/md/lg)
- **Optimized**: Proper image optimization and error handling

## Validation Rules
Each country has specific validation rules:
- **India (+91)**: 10 digits, must start with 6-9
- **US/Canada (+1)**: 10 digits
- **UK (+44)**: 10 digits
- **And many more...**

## Implementation Details

### Usage Example
```tsx
<PhoneInput
  value={phoneNumber}
  onChange={(phone) => setPhoneNumber(phone)}
  placeholder="Enter phone number"
  required
  size="md"
/>
```

### Key Features
1. **Protected Country Code**: Users cannot delete the country code from the input
2. **Smart Validation**: Real-time validation based on country-specific rules
3. **Visual Feedback**: Shows validation messages and success indicators
4. **Paste Handling**: Intelligently handles pasted phone numbers with country codes
5. **Keyboard Protection**: Prevents backspace from deleting country code
6. **Flag Display**: Shows actual country flags with emoji fallback
7. **Responsive Design**: Adapts flag size based on component size

## Files Modified
- `components/common/PhoneInput/PhoneInput.tsx` (new)
- `components/common/CountryCodeSelect/CountryCodeSelect.tsx` (updated with flags)
- `components/common/ReachForm/ReachForm.tsx`
- `components/common/LeadForm/LeadForm.tsx`
- `next.config.mjs` (added flagcdn.com domain)
- `app/globals.css` (removed old styles)

### Forms Updated
1. **ReachForm** (`components/common/ReachForm/ReachForm.tsx`)
2. **LeadForm** (`components/common/LeadForm/LeadForm.tsx`)

### Key Features
- **Real Flag Icons**: Actual country flag images (not emojis)
- **Auto-formatting**: Formats phone numbers according to country standards
- **Search Functionality**: Users can search for countries
- **Validation**: Built-in phone number validation
- **Responsive Design**: Works on mobile and desktop

## Configuration

### ReachForm (Small/Compact)
```tsx
<PhoneInput
    country={'in'}                    // Default to India
    value={phoneNumber}
    onChange={(phone) => {
        setPhoneNumber(phone);
        setValue('phone', phone);
    }}
    inputStyle={{
        width: '100%',
        height: '32px',               // Compact height
        fontSize: '14px',
        paddingLeft: '48px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
    }}
    placeholder="Enter phone number"
    enableSearch={true}
    searchPlaceholder="Search countries"
/>
```

### LeadForm (Standard Size)
```tsx
<PhoneInput
    country={'in'}                    // Default to India
    value={phoneNumber}
    onChange={(phone) => {
        setPhoneNumber(phone);
        setValue('phone', phone);
    }}
    inputStyle={{
        width: '100%',
        height: '40px',               // Standard height
        fontSize: '16px',
        paddingLeft: '48px',
        border: '1px solid #d1d5db',
        borderRadius: '6px',
    }}
    placeholder="Phone Number*"
    enableSearch={true}
    searchPlaceholder="Search countries"
/>
```

## Custom Styling

### CSS File: `styles/phone-input.css`
- **Form Control**: Input field styling
- **Flag Dropdown**: Country selector button
- **Country List**: Dropdown menu styling
- **Search Box**: Country search input
- **Responsive Classes**: `.reach-form` and `.lead-form` for different sizes

### Key Style Features
- Matches existing form design
- Proper focus states
- Hover effects
- Mobile-responsive
- Consistent with UI components

## Data Handling

### State Management
```tsx
const [phoneNumber, setPhoneNumber] = useState('');

// Update both component state and form state
onChange={(phone) => {
    setPhoneNumber(phone);
    setValue('phone', phone);
}}
```

### Form Submission
```tsx
const onSubmit = async (data: any) => {
    // phoneNumber contains formatted international number
    // Example: "919876543210" for Indian number
    const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...data,
            phone: phoneNumber, // Formatted phone number
            formType: "course-callback",
        }),
    });
};
```

## Benefits Over Custom Solution

### User Experience
- **Real Flags**: Actual country flag images instead of emojis
- **Auto-formatting**: Phone numbers format as user types
- **Search**: Easy country selection with search
- **Validation**: Built-in phone number validation
- **Mobile Optimized**: Better mobile keyboard support

### Developer Experience
- **Less Code**: No custom component maintenance
- **Battle-tested**: Widely used package with good support
- **Feature Rich**: Many built-in features
- **Customizable**: Extensive styling options
- **TypeScript Support**: Full type definitions

### Technical Advantages
- **Performance**: Optimized rendering and flag loading
- **Accessibility**: Better screen reader support
- **Internationalization**: Supports all countries
- **Standards Compliant**: Follows international phone number standards

## Phone Number Format

### Output Examples
- **India**: `919876543210` (country code + number)
- **US**: `15551234567`
- **UK**: `447911123456`
- **UAE**: `971501234567`

### API Integration
The formatted phone number is automatically sent to the API in international format, making it easy to:
- Store in database
- Send SMS/WhatsApp messages
- Validate phone numbers
- Display consistently

## Troubleshooting

### Common Issues
1. **Flags not loading**: Ensure internet connection for flag images
2. **Styling conflicts**: Check CSS specificity in custom styles
3. **Form validation**: Use the formatted phone number from state
4. **Mobile issues**: Test on actual devices for keyboard behavior

### CSS Customization
- Modify `styles/phone-input.css` for design changes
- Use browser dev tools to inspect component structure
- Override specific classes for fine-tuning
- Test across different screen sizes

## Future Enhancements
- **Validation Rules**: Add custom validation for specific countries
- **Preferred Countries**: Show frequently used countries first
- **Auto-detection**: Detect user's country from IP
- **Custom Flags**: Use custom flag images if needed