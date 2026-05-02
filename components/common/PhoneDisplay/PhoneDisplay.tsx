import React from 'react';

interface PhoneDisplayProps {
  phone: string;
  className?: string;
}

// Function to extract country code and format phone number
const parsePhoneNumber = (phone: string) => {
  if (!phone) return { countryCode: '', number: '', flagUrl: '' };
  
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Common country codes mapping
  const countryMappings: { [key: string]: { code: string; flag: string; name: string } } = {
    '91': { code: '+91', flag: 'in', name: 'India' },
    '1': { code: '+1', flag: 'us', name: 'United States' },
    '44': { code: '+44', flag: 'gb', name: 'United Kingdom' },
    '61': { code: '+61', flag: 'au', name: 'Australia' },
    '33': { code: '+33', flag: 'fr', name: 'France' },
    '49': { code: '+49', flag: 'de', name: 'Germany' },
    '81': { code: '+81', flag: 'jp', name: 'Japan' },
    '86': { code: '+86', flag: 'cn', name: 'China' },
    '55': { code: '+55', flag: 'br', name: 'Brazil' },
    '7': { code: '+7', flag: 'ru', name: 'Russia' },
    '39': { code: '+39', flag: 'it', name: 'Italy' },
    '34': { code: '+34', flag: 'es', name: 'Spain' },
    '31': { code: '+31', flag: 'nl', name: 'Netherlands' },
    '46': { code: '+46', flag: 'se', name: 'Sweden' },
    '47': { code: '+47', flag: 'no', name: 'Norway' },
    '45': { code: '+45', flag: 'dk', name: 'Denmark' },
    '358': { code: '+358', flag: 'fi', name: 'Finland' },
    '41': { code: '+41', flag: 'ch', name: 'Switzerland' },
    '43': { code: '+43', flag: 'at', name: 'Austria' },
    '32': { code: '+32', flag: 'be', name: 'Belgium' },
    '48': { code: '+48', flag: 'pl', name: 'Poland' },
    '420': { code: '+420', flag: 'cz', name: 'Czech Republic' },
    '36': { code: '+36', flag: 'hu', name: 'Hungary' },
    '30': { code: '+30', flag: 'gr', name: 'Greece' },
    '351': { code: '+351', flag: 'pt', name: 'Portugal' },
    '353': { code: '+353', flag: 'ie', name: 'Ireland' },
    '64': { code: '+64', flag: 'nz', name: 'New Zealand' },
    '27': { code: '+27', flag: 'za', name: 'South Africa' },
    '65': { code: '+65', flag: 'sg', name: 'Singapore' },
    '60': { code: '+60', flag: 'my', name: 'Malaysia' },
    '66': { code: '+66', flag: 'th', name: 'Thailand' },
    '63': { code: '+63', flag: 'ph', name: 'Philippines' },
    '62': { code: '+62', flag: 'id', name: 'Indonesia' },
    '84': { code: '+84', flag: 'vn', name: 'Vietnam' },
    '82': { code: '+82', flag: 'kr', name: 'South Korea' },
    '971': { code: '+971', flag: 'ae', name: 'UAE' },
    '966': { code: '+966', flag: 'sa', name: 'Saudi Arabia' },
    '20': { code: '+20', flag: 'eg', name: 'Egypt' },
    '972': { code: '+972', flag: 'il', name: 'Israel' },
    '90': { code: '+90', flag: 'tr', name: 'Turkey' },
    '92': { code: '+92', flag: 'pk', name: 'Pakistan' },
    '880': { code: '+880', flag: 'bd', name: 'Bangladesh' },
    '94': { code: '+94', flag: 'lk', name: 'Sri Lanka' },
    '977': { code: '+977', flag: 'np', name: 'Nepal' },
    '95': { code: '+95', flag: 'mm', name: 'Myanmar' },
    '855': { code: '+855', flag: 'kh', name: 'Cambodia' },
    '856': { code: '+856', flag: 'la', name: 'Laos' },
    '975': { code: '+975', flag: 'bt', name: 'Bhutan' },
    '960': { code: '+960', flag: 'mv', name: 'Maldives' }
  };

  // Try to match country codes (longest first for accuracy)
  const sortedCodes = Object.keys(countryMappings).sort((a, b) => b.length - a.length);
  
  for (const code of sortedCodes) {
    if (cleanPhone.startsWith(code)) {
      const country = countryMappings[code];
      const remainingNumber = cleanPhone.substring(code.length);
      
      return {
        countryCode: country.code,
        number: remainingNumber,
        flagUrl: `https://flagcdn.com/w20/${country.flag}.png`,
        countryName: country.name,
        fullNumber: `${country.code} ${remainingNumber}`
      };
    }
  }

  // Default to India if no country code detected and number looks Indian
  if (cleanPhone.length === 10) {
    return {
      countryCode: '+91',
      number: cleanPhone,
      flagUrl: 'https://flagcdn.com/w20/in.png',
      countryName: 'India',
      fullNumber: `+91 ${cleanPhone}`
    };
  }

  // Return original if can't parse
  return {
    countryCode: '',
    number: phone,
    flagUrl: '',
    countryName: 'Unknown',
    fullNumber: phone
  };
};

const PhoneDisplay: React.FC<PhoneDisplayProps> = ({ phone, className = '' }) => {
  const { countryCode, number, flagUrl, countryName, fullNumber } = parsePhoneNumber(phone);

  if (!phone) {
    return <span className={`text-zinc-400 ${className}`}>-</span>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`} title={`${fullNumber} (${countryName})`}>
      {flagUrl && (
        <img
          src={flagUrl}
          alt={`${countryName} flag`}
          className="w-5 h-4 object-cover rounded-sm flex-shrink-0 border border-zinc-600"
          onError={(e) => {
            // Hide flag if it fails to load
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <div className="flex flex-col min-w-0">
        <span className="text-white text-sm font-medium truncate" title={fullNumber}>
          {countryCode && (
            <span className="text-blue-400 font-mono">{countryCode}</span>
          )}
          {countryCode && number && ' '}
          <span className="font-mono">{number}</span>
        </span>
        {countryName !== 'Unknown' && (
          <span className="text-zinc-500 text-xs truncate" title={countryName}>
            {countryName}
          </span>
        )}
      </div>
    </div>
  );
};

export default PhoneDisplay;