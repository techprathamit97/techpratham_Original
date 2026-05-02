// Simple test cases for phone number parsing
// This is for documentation purposes - shows expected behavior

const testCases = [
  // Indian numbers
  { input: '919876543210', expected: { code: '+91', country: 'India' } },
  { input: '+91 9876543210', expected: { code: '+91', country: 'India' } },
  { input: '9876543210', expected: { code: '+91', country: 'India' } }, // 10 digit defaults to India
  
  // US numbers
  { input: '14155552671', expected: { code: '+1', country: 'United States' } },
  { input: '+1 415 555 2671', expected: { code: '+1', country: 'United States' } },
  
  // UK numbers
  { input: '447911123456', expected: { code: '+44', country: 'United Kingdom' } },
  { input: '+44 7911 123456', expected: { code: '+44', country: 'United Kingdom' } },
  
  // Other countries
  { input: '33123456789', expected: { code: '+33', country: 'France' } },
  { input: '49123456789', expected: { code: '+49', country: 'Germany' } },
  { input: '81312345678', expected: { code: '+81', country: 'Japan' } },
  
  // Edge cases
  { input: '', expected: { display: '-' } },
  { input: 'invalid', expected: { display: 'invalid' } },
  { input: '123', expected: { display: '123' } }, // Too short
];

export default testCases;