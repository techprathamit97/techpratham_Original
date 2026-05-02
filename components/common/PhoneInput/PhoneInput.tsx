import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import CountryCodeSelect, { countryCodes } from '../CountryCodeSelect/CountryCodeSelect';

// Phone validation rules for different countries
const phoneValidationRules: { [key: string]: { length: number; pattern: RegExp; example: string } } = {
  // Existing Rules...
  '+91': { length: 10, pattern: /^[6-9]\d{9}$/, example: '9876543210' },
  '+1': { length: 10, pattern: /^\d{10}$/, example: '2345678901' },
  '+44': { length: 10, pattern: /^\d{10}$/, example: '7911123456' },
  '+61': { length: 9, pattern: /^\d{9}$/, example: '412345678' },
  '+49': { length: 11, pattern: /^\d{11}$/, example: '15123456789' },
  '+33': { length: 9, pattern: /^\d{9}$/, example: '612345678' },
  '+81': { length: 10, pattern: /^\d{10}$/, example: '9012345678' },
  '+86': { length: 11, pattern: /^\d{11}$/, example: '13812345678' },
  '+7': { length: 10, pattern: /^\d{10}$/, example: '9123456789' },
  '+55': { length: 11, pattern: /^\d{11}$/, example: '11987654321' },
  '+27': { length: 9, pattern: /^\d{9}$/, example: '821234567' },
  '+971': { length: 9, pattern: /^\d{9}$/, example: '501234567' },
  '+65': { length: 8, pattern: /^\d{8}$/, example: '91234567' },
  '+60': { length: 9, pattern: /^\d{9}$/, example: '123456789' },
  '+852': { length: 8, pattern: /^\d{8}$/, example: '91234567' },
  '+66': { length: 9, pattern: /^\d{9}$/, example: '812345678' },
  '+84': { length: 9, pattern: /^\d{9}$/, example: '912345678' },
  '+62': { length: 10, pattern: /^\d{10}$/, example: '8123456789' },
  '+63': { length: 10, pattern: /^\d{10}$/, example: '9171234567' },
  '+82': { length: 10, pattern: /^\d{10}$/, example: '1012345678' },
  '+92': { length: 10, pattern: /^\d{10}$/, example: '3001234567' },
  '+880': { length: 10, pattern: /^\d{10}$/, example: '1712345678' },
  '+94': { length: 9, pattern: /^\d{9}$/, example: '712345678' },
  '+977': { length: 10, pattern: /^\d{10}$/, example: '9841234567' },
  '+39': { length: 10, pattern: /^\d{10}$/, example: '3123456789' },
  '+34': { length: 9, pattern: /^\d{9}$/, example: '612345678' },
  '+31': { length: 9, pattern: /^\d{9}$/, example: '612345678' },
  '+46': { length: 9, pattern: /^\d{9}$/, example: '701234567' },
  '+47': { length: 8, pattern: /^\d{8}$/, example: '91234567' },

  // New Additions
  '+93': { length: 9, pattern: /^\d{9}$/, example: '701234567' }, // Afghanistan
  '+355': { length: 9, pattern: /^\d{9}$/, example: '681234567' }, // Albania
  '+213': { length: 9, pattern: /^\d{9}$/, example: '512345678' }, // Algeria
  '+376': { length: 6, pattern: /^\d{6}$/, example: '123456' }, // Andorra
  '+244': { length: 9, pattern: /^\d{9}$/, example: '912345678' }, // Angola
  '+54': { length: 10, pattern: /^\d{10}$/, example: '1123456789' }, // Argentina
  '+374': { length: 8, pattern: /^\d{8}$/, example: '12345678' }, // Armenia
  '+43': { length: 10, pattern: /^\d{10}$/, example: '6641234567' }, // Austria
  '+994': { length: 9, pattern: /^\d{9}$/, example: '501234567' }, // Azerbaijan
  '+973': { length: 8, pattern: /^\d{8}$/, example: '31234567' }, // Bahrain
  '+32': { length: 9, pattern: /^\d{9}$/, example: '412345678' }, // Belgium
  '+501': { length: 7, pattern: /^\d{7}$/, example: '6123456' }, // Belize
  '+975': { length: 8, pattern: /^\d{8}$/, example: '17123456' }, // Bhutan
  '+591': { length: 8, pattern: /^\d{8}$/, example: '71234567' }, // Bolivia
  '+387': { length: 8, pattern: /^\d{8}$/, example: '61234567' }, // Bosnia
  '+673': { length: 7, pattern: /^\d{7}$/, example: '8123456' }, // Brunei
  '+359': { length: 9, pattern: /^\d{9}$/, example: '871234567' }, // Bulgaria
  '+226': { length: 8, pattern: /^\d{8}$/, example: '70123456' }, // Burkina Faso
  '+855': { length: 9, pattern: /^\d{9}$/, example: '123456789' }, // Cambodia
  '+237': { length: 9, pattern: /^\d{9}$/, example: '612345678' }, // Cameroon
  '+56': { length: 9, pattern: /^\d{9}$/, example: '912345678' }, // Chile
  '+57': { length: 10, pattern: /^\d{10}$/, example: '3001234567' }, // Colombia
  '+506': { length: 8, pattern: /^\d{8}$/, example: '81234567' }, // Costa Rica
  '+385': { length: 9, pattern: /^\d{9}$/, example: '912345678' }, // Croatia
  '+53': { length: 8, pattern: /^\d{8}$/, example: '51234567' }, // Cuba
  '+357': { length: 8, pattern: /^\d{8}$/, example: '99123456' }, // Cyprus
  '+420': { length: 9, pattern: /^\d{9}$/, example: '601234567' }, // Czechia
  '+45': { length: 8, pattern: /^\d{8}$/, example: '21234567' }, // Denmark
  '+20': { length: 10, pattern: /^\d{10}$/, example: '1012345678' }, // Egypt
  '+372': { length: 8, pattern: /^\d{8}$/, example: '51234567' }, // Estonia
  '+251': { length: 9, pattern: /^\d{9}$/, example: '911234567' }, // Ethiopia
  '+358': { length: 9, pattern: /^\d{9}$/, example: '401234567' }, // Finland
  '+995': { length: 9, pattern: /^\d{9}$/, example: '591234567' }, // Georgia
  '+233': { length: 9, pattern: /^\d{9}$/, example: '241234567' }, // Ghana
  '+30': { length: 10, pattern: /^\d{10}$/, example: '6912345678' }, // Greece
  '+502': { length: 8, pattern: /^\d{8}$/, example: '41234567' }, // Guatemala
  '+36': { length: 9, pattern: /^\d{9}$/, example: '201234567' }, // Hungary
  '+354': { length: 7, pattern: /^\d{7}$/, example: '8123456' }, // Iceland
  '+964': { length: 10, pattern: /^\d{10}$/, example: '7701234567' }, // Iraq
  '+353': { length: 9, pattern: /^\d{9}$/, example: '851234567' }, // Ireland
  '+972': { length: 9, pattern: /^\d{9}$/, example: '501234567' }, // Israel
  '+962': { length: 9, pattern: /^\d{9}$/, example: '791234567' }, // Jordan
  '+254': { length: 9, pattern: /^\d{9}$/, example: '712345678' }, // Kenya
  '+965': { length: 8, pattern: /^\d{8}$/, example: '51234567' }, // Kuwait
  '+961': { length: 8, pattern: /^\d{8}$/, example: '70123456' }, // Lebanon
  '+218': { length: 9, pattern: /^\d{9}$/, example: '912345678' }, // Libya
  '+370': { length: 8, pattern: /^\d{8}$/, example: '61234567' }, // Lithuania
  '+352': { length: 9, pattern: /^\d{9}$/, example: '621123456' }, // Luxembourg
  '+52': { length: 10, pattern: /^\d{10}$/, example: '5512345678' }, // Mexico
  '+377': { length: 8, pattern: /^\d{8}$/, example: '61234567' }, // Monaco
  '+212': { length: 9, pattern: /^\d{9}$/, example: '612345678' }, // Morocco
  '+234': { length: 10, pattern: /^\d{10}$/, example: '8031234567' }, // Nigeria
  '+64': { length: 9, pattern: /^\d{9}$/, example: '211234567' }, // New Zealand
  '+968': { length: 8, pattern: /^\d{8}$/, example: '91234567' }, // Oman
  '+51': { length: 9, pattern: /^\d{9}$/, example: '912345678' }, // Peru
  '+48': { length: 9, pattern: /^\d{9}$/, example: '501234567' }, // Poland
  '+351': { length: 9, pattern: /^\d{9}$/, example: '912345678' }, // Portugal
  '+974': { length: 8, pattern: /^\d{8}$/, example: '55123456' }, // Qatar
  '+40': { length: 9, pattern: /^\d{9}$/, example: '721234567' }, // Romania
  '+966': { length: 9, pattern: /^\d{9}$/, example: '501234567' }, // Saudi Arabia
  '+381': { length: 9, pattern: /^\d{9}$/, example: '611234567' }, // Serbia
  '+421': { length: 9, pattern: /^\d{9}$/, example: '901234567' }, // Slovakia
  '+41': { length: 9, pattern: /^\d{9}$/, example: '791234567' }, // Switzerland
  '+886': { length: 9, pattern: /^\d{9}$/, example: '912345678' }, // Taiwan
  '+90': { length: 10, pattern: /^\d{10}$/, example: '5321234567' }, // Turkey
  '+380': { length: 9, pattern: /^\d{9}$/, example: '631234567' }, // Ukraine
  '+598': { length: 8, pattern: /^\d{8}$/, example: '94123456' }, // Uruguay
  '+58': { length: 10, pattern: /^\d{10}$/, example: '4121234567' },
  // '+852': { length: 8, pattern: /^\d{8}$/, example: '91234567' } // Hong Kong
};

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  onValidationChange,
  placeholder = "Enter phone number",
  className = '',
  required = false,
  error,
  size = 'md'
}) => {
  const [countryCode, setCountryCode] = useState('+91'); // Default to India
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [touched, setTouched] = useState(false);

  // Parse initial value
  useEffect(() => {
    if (value) {
      // Try to extract country code and number from the full value
      const foundCountry = countryCodes.find(country => value.startsWith(country.code));
      if (foundCountry) {
        setCountryCode(foundCountry.code);
        setPhoneNumber(value.substring(foundCountry.code.length));
      } else {
        // If no country code found, assume it's just the number
        setPhoneNumber(value);
      }
    }
  }, []);

  // Validate phone number based on country
  const validatePhoneNumber = (number: string, code: string) => {
    let valid = true;
    let message = '';

    if (!number || number.trim() === '') {
      if (required) {
        valid = false;
        message = 'Phone number is required';
      }
    } else {
      const rules = phoneValidationRules[code];
      if (rules) {
        // Remove any non-digit characters
        const cleanNumber = number.replace(/\D/g, '');
        
        if (cleanNumber.length !== rules.length) {
          valid = false;
          message = `Phone Number Should Be ${rules.length} Digits. Example: ${rules.example}`;
        } else if (!rules.pattern.test(cleanNumber)) {
          valid = false;
          message = `Invalid phone number format. Example: ${rules.example}`;
        }
      }
    }

    setIsValid(valid);
    setValidationMessage(message);
    
    // Notify parent component of validation state change
    if (onValidationChange) {
      onValidationChange(valid);
    }
    
    return valid;
  };

  const handleCountryChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    const fullNumber = phoneNumber ? `${newCountryCode}${phoneNumber.replace(/\D/g, '')}` : newCountryCode;
    onChange(fullNumber);
    validatePhoneNumber(phoneNumber, newCountryCode);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove any non-digit characters except spaces and dashes for formatting
    const cleanValue = inputValue.replace(/[^\d\s-]/g, '');
    
    // Prevent user from typing country code
    if (cleanValue.startsWith(countryCode.substring(1))) {
      inputValue = cleanValue.substring(countryCode.length - 1);
    } else {
      inputValue = cleanValue;
    }

    setPhoneNumber(inputValue);
    
    // Create full phone number
    const cleanNumber = inputValue.replace(/\D/g, '');
    const fullNumber = cleanNumber ? `${countryCode}${cleanNumber}` : countryCode;
    
    onChange(fullNumber);
    validatePhoneNumber(inputValue, countryCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent backspace from deleting country code
    const input = e.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    
    if (e.key === 'Backspace' && cursorPosition === 0 && phoneNumber.length === 0) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // If pasted text contains a country code, extract just the number part
    const foundCountry = countryCodes.find(country => pastedText.startsWith(country.code));
    if (foundCountry) {
      const numberPart = pastedText.substring(foundCountry.code.length);
      setCountryCode(foundCountry.code);
      setPhoneNumber(numberPart);
      onChange(pastedText);
      validatePhoneNumber(numberPart, foundCountry.code);
    } else {
      // Just paste as phone number
      const cleanNumber = pastedText.replace(/\D/g, '');
      setPhoneNumber(cleanNumber);
      onChange(`${countryCode}${cleanNumber}`);
      validatePhoneNumber(cleanNumber, countryCode);
    }
  };

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex">
        <CountryCodeSelect
          value={countryCode}
          onValueChange={handleCountryChange}
          size={size}
          className="rounded-r-none border-r-0"
        />
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          required={required}
          className={`flex-1 rounded-l-none ${sizeClasses[size]} ${
            !isValid && touched ? 'border-red-500 focus:border-red-500' : ''
          }`}
          autoComplete="tel"
          aria-invalid={!isValid && touched}
          aria-describedby={!isValid && touched ? "phone-error" : undefined}
        />
      </div>
      
      {/* Validation message */}
      {!isValid && touched && (validationMessage || error) && (
        <p id="phone-error" className="text-red-500 text-sm mt-1" role="alert">
          {error || validationMessage}
        </p>
      )}
      
      {/* Success indicator */}
      {isValid && phoneNumber && !error && touched && (
        <p className="text-green-500 text-sm mt-1">
          ✓ Valid phone number
        </p>
      )}
      

    </div>
  );
};

export default PhoneInput;