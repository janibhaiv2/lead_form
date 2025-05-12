// Country codes with their respective formats
// FORMAT GUIDE:
// - 'code': Country calling code with + sign (e.g., '+91')
// - 'country': Country name displayed in dropdown
// - 'format': Format pattern where 'X' represents a digit
//   Example: '(XXX) XXX-XXXX' will format as '(123) 456-7890'
//   Spaces, dashes, brackets will appear in the formatted number
// - 'placeholder': Example shown to user when input is empty
// - 'maxLength': Maximum total length including spaces and special characters
const countryCodes = [
  // North America
  { code: '+1', country: 'USA (United States of America)', format: '(XXX) XXX-XXXX', placeholder: '(123) 456-7890', maxLength: 14 },
  { code: '+1', country: 'Canada', format: '(XXX) XXX-XXXX', placeholder: '(123) 456-7890', maxLength: 14 },
  { code: '+52', country: 'Mexico', format: '(XX) XXXX XXXX', placeholder: '(55) 1234 5678', maxLength: 15 },

  // Europe
  { code: '+44', country: 'UK (United Kingdom)', format: 'XXXX XXXXXX', placeholder: '7911 123456', maxLength: 13 },
  { code: '+49', country: 'Germany (Deutschland)', format: 'XXX XXXXXXX', placeholder: '170 1234567', maxLength: 14 },
  { code: '+33', country: 'France', format: 'X XX XX XX XX', placeholder: '6 12 34 56 78', maxLength: 14 },
  { code: '+39', country: 'Italy (Italia)', format: 'XXX XXX XXXX', placeholder: '312 345 6789', maxLength: 13 },
  { code: '+34', country: 'Spain (España)', format: 'XXX XXX XXX', placeholder: '612 345 678', maxLength: 12 },
  { code: '+31', country: 'Netherlands (Nederland)', format: 'X XX XX XX XX', placeholder: '6 12 34 56 78', maxLength: 14 },
  { code: '+41', country: 'Switzerland (Schweiz/Suisse)', format: 'XX XXX XX XX', placeholder: '78 123 45 67', maxLength: 13 },
  { code: '+46', country: 'Sweden (Sverige)', format: 'XX XXX XX XX', placeholder: '70 123 45 67', maxLength: 13 },
  { code: '+47', country: 'Norway (Norge)', format: 'XXX XX XXX', placeholder: '406 12 345', maxLength: 11 },
  { code: '+45', country: 'Denmark (Danmark)', format: 'XX XX XX XX', placeholder: '20 12 34 56', maxLength: 11 },
  { code: '+358', country: 'Finland (Suomi)', format: 'XX XXX XXXX', placeholder: '40 123 4567', maxLength: 13 },
  { code: '+48', country: 'Poland (Polska)', format: 'XXX XXX XXX', placeholder: '512 345 678', maxLength: 12 },
  { code: '+43', country: 'Austria (Österreich)', format: 'XXX XXXXXX', placeholder: '664 123456', maxLength: 13 },
  { code: '+32', country: 'Belgium (België/Belgique)', format: 'XXX XX XX XX', placeholder: '470 12 34 56', maxLength: 13 },
  { code: '+351', country: 'Portugal', format: 'XXX XXX XXX', placeholder: '912 345 678', maxLength: 13 },
  { code: '+353', country: 'Ireland (Éire)', format: 'XX XXX XXXX', placeholder: '85 123 4567', maxLength: 13 },
  { code: '+30', country: 'Greece (Ελλάδα)', format: 'XXX XXX XXXX', placeholder: '697 123 4567', maxLength: 14 },
  { code: '+420', country: 'Czech Republic (Česká republika)', format: 'XXX XXX XXX', placeholder: '601 123 456', maxLength: 13 },
  { code: '+36', country: 'Hungary (Magyarország)', format: 'XX XXX XXXX', placeholder: '20 123 4567', maxLength: 13 },

  // Asia
  { code: '+91', country: 'India (भारत)', format: 'XXXXX XXXXX', placeholder: '98765 43210', maxLength: 12 },
  { code: '+92', country: 'Pakistan (پاکستان اردو)', format: 'XXX XXXXXXX', placeholder: '300 1234567', maxLength: 13 },
  { code: '+86', country: 'China (中国)', format: 'XXX XXXX XXXX', placeholder: '139 1234 5678', maxLength: 14 },
  { code: '+81', country: 'Japan (日本)', format: 'XX XXXX XXXX', placeholder: '90 1234 5678', maxLength: 13 },
  { code: '+82', country: 'South Korea (대한민국)', format: 'XX XXXX XXXX', placeholder: '10 1234 5678', maxLength: 13 },
  { code: '+65', country: 'Singapore (新加坡)', format: 'XXXX XXXX', placeholder: '9123 4567', maxLength: 10 },
  { code: '+66', country: 'Thailand (ประเทศไทย)', format: 'X XXXX XXXX', placeholder: '8 1234 5678', maxLength: 12 },
  { code: '+60', country: 'Malaysia (مليسيا)', format: 'XX XXXX XXXX', placeholder: '12 3456 7890', maxLength: 13 },
  { code: '+84', country: 'Vietnam (Việt Nam)', format: 'XXX XXX XXX', placeholder: '912 345 678', maxLength: 12 },
  { code: '+62', country: 'Indonesia', format: 'XXX XXX XXXX', placeholder: '812 345 6789', maxLength: 14 },
  { code: '+63', country: 'Philippines (Pilipinas)', format: 'XXX XXX XXXX', placeholder: '917 123 4567', maxLength: 14 },
  { code: '+880', country: 'Bangladesh (বাংলাদেশ)', format: 'XXXX XXXXXX', placeholder: '1711 123456', maxLength: 14 },
  { code: '+94', country: 'Sri Lanka (ශ්‍රී ලංකාව)', format: 'XX XXX XXXX', placeholder: '71 234 5678', maxLength: 13 },
  { code: '+95', country: 'Myanmar (မြန်မာ)', format: 'X XXX XXXX', placeholder: '9 123 4567', maxLength: 11 },
  { code: '+977', country: 'Nepal (नेपाल)', format: 'XXX XXXXXXX', placeholder: '984 1234567', maxLength: 14 },
  { code: '+93', country: 'Afghanistan (افغانستان)', format: 'XX XXX XXXX', placeholder: '70 123 4567', maxLength: 13 },

  // Middle East
  { code: '+971', country: 'UAE (United Arab Emirates / الإمارات)', format: 'XX XXX XXXX', placeholder: '50 123 4567', maxLength: 12 },
  { code: '+966', country: 'Saudi Arabia (المملكة العربية السعودية)', format: 'XX XXX XXXX', placeholder: '50 123 4567', maxLength: 13 },
  { code: '+974', country: 'Qatar (قطر)', format: 'XXXX XXXX', placeholder: '3312 3456', maxLength: 10 },
  { code: '+973', country: 'Bahrain (البحرين)', format: 'XXXX XXXX', placeholder: '3312 3456', maxLength: 10 },
  { code: '+965', country: 'Kuwait (الكويت)', format: 'XXXX XXXX', placeholder: '5123 4567', maxLength: 10 },
  { code: '+968', country: 'Oman (عمان)', format: 'XXXX XXXX', placeholder: '9123 4567', maxLength: 10 },
  { code: '+962', country: 'Jordan (الأردن)', format: 'X XXXX XXXX', placeholder: '7 9012 3456', maxLength: 12 },
  { code: '+961', country: 'Lebanon (لبنان)', format: 'XX XXX XXX', placeholder: '71 123 456', maxLength: 11 },
  { code: '+972', country: 'Israel (ישראל)', format: 'XX XXX XXXX', placeholder: '50 123 4567', maxLength: 13 },
  { code: '+964', country: 'Iraq (العراق)', format: 'XXX XXX XXXX', placeholder: '750 123 4567', maxLength: 14 },

  // Oceania
  { code: '+61', country: 'Australia', format: 'XXX XXX XXX', placeholder: '412 345 678', maxLength: 12 },
  { code: '+64', country: 'New Zealand (Aotearoa)', format: 'XX XXX XXXX', placeholder: '21 123 4567', maxLength: 12 },
  { code: '+675', country: 'Papua New Guinea', format: 'XXX XXXX', placeholder: '684 5678', maxLength: 9 },
  { code: '+679', country: 'Fiji', format: 'XXX XXXX', placeholder: '701 2345', maxLength: 9 },

  // Africa
  { code: '+27', country: 'South Africa', format: 'XX XXX XXXX', placeholder: '71 234 5678', maxLength: 13 },
  { code: '+20', country: 'Egypt (مصر)', format: 'XX XXXX XXXX', placeholder: '10 1234 5678', maxLength: 14 },
  { code: '+234', country: 'Nigeria', format: 'XX XXXX XXXX', placeholder: '80 1234 5678', maxLength: 14 },
  { code: '+254', country: 'Kenya', format: 'XXX XXX XXX', placeholder: '712 345 678', maxLength: 13 },
  { code: '+212', country: 'Morocco (المغرب)', format: 'XX XXX XXXX', placeholder: '61 234 5678', maxLength: 13 },
  { code: '+216', country: 'Tunisia (تونس)', format: 'XX XXX XXX', placeholder: '20 123 456', maxLength: 11 },
  { code: '+233', country: 'Ghana', format: 'XX XXX XXXX', placeholder: '24 123 4567', maxLength: 13 },
  { code: '+251', country: 'Ethiopia (ኢትዮጵያ)', format: 'XX XXX XXXX', placeholder: '91 123 4567', maxLength: 13 },
  { code: '+255', country: 'Tanzania', format: 'XXX XXX XXX', placeholder: '712 345 678', maxLength: 13 },
  { code: '+256', country: 'Uganda', format: 'XXX XXX XXX', placeholder: '712 345 678', maxLength: 13 },
  { code: '+260', country: 'Zambia', format: 'XX XXX XXXX', placeholder: '95 123 4567', maxLength: 13 },
  { code: '+263', country: 'Zimbabwe', format: 'XX XXX XXXX', placeholder: '71 234 5678', maxLength: 13 },

  // South America
  { code: '+55', country: 'Brazil (Brasil)', format: 'XX XXXXX XXXX', placeholder: '11 98765 4321', maxLength: 15 },
  { code: '+54', country: 'Argentina', format: 'XX XXXX XXXX', placeholder: '11 1234 5678', maxLength: 14 },
  { code: '+56', country: 'Chile', format: 'X XXXX XXXX', placeholder: '9 1234 5678', maxLength: 12 },
  { code: '+57', country: 'Colombia', format: 'XXX XXX XXXX', placeholder: '300 123 4567', maxLength: 14 },
  { code: '+51', country: 'Peru (Perú)', format: 'XXX XXX XXX', placeholder: '912 345 678', maxLength: 12 },
  { code: '+58', country: 'Venezuela', format: 'XXX XXX XXXX', placeholder: '412 123 4567', maxLength: 14 },
  { code: '+593', country: 'Ecuador', format: 'XX XXX XXXX', placeholder: '99 123 4567', maxLength: 13 },
  { code: '+591', country: 'Bolivia', format: 'X XXX XXXX', placeholder: '7 123 4567', maxLength: 11 },
  { code: '+595', country: 'Paraguay', format: 'XXX XXX XXX', placeholder: '981 123 456', maxLength: 13 },
  { code: '+598', country: 'Uruguay', format: 'X XXX XXXX', placeholder: '9 123 4567', maxLength: 11 },
];
