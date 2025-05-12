// List of countries for dropdown menus
const countries = [
  // North America
  "USA (United States of America)",
  "Canada",
  "Mexico",

  // Europe
  "UK (United Kingdom)",
  "Germany (Deutschland)",
  "France",
  "Italy (Italia)",
  "Spain (España)",
  "Netherlands (Nederland)",
  "Switzerland (Schweiz/Suisse)",
  "Sweden (Sverige)",
  "Norway (Norge)",
  "Denmark (Danmark)",
  "Finland (Suomi)",
  "Poland (Polska)",
  "Austria (Österreich)",
  "Belgium (België/Belgique)",
  "Portugal",
  "Ireland (Éire)",
  "Greece (Ελλάδα)",
  "Czech Republic (Česká republika)",
  "Hungary (Magyarország)",

  // Asia
  "India (भारत)",
  "Pakistan (پاکستان اردو)",
  "China (中国)",
  "Japan (日本)",
  "South Korea (대한민국)",
  "Singapore (新加坡)",
  "Thailand (ประเทศไทย)",
  "Malaysia (مليسيا)",
  "Vietnam (Việt Nam)",
  "Indonesia",
  "Philippines (Pilipinas)",
  "Bangladesh (বাংলাদেশ)",
  "Sri Lanka (ශ්‍රී ලංකාව)",
  "Myanmar (မြန်မာ)",
  "Nepal (नेपाल)",
  "Afghanistan (افغانستان)",

  // Middle East
  "UAE (United Arab Emirates / الإمارات)",
  "Saudi Arabia (المملكة العربية السعودية)",
  "Qatar (قطر)",
  "Bahrain (البحرين)",
  "Kuwait (الكويت)",
  "Oman (عمان)",
  "Jordan (الأردن)",
  "Lebanon (لبنان)",
  "Israel (ישראל)",
  "Iraq (العراق)",

  // Oceania
  "Australia",
  "New Zealand (Aotearoa)",
  "Papua New Guinea",
  "Fiji",

  // Africa
  "South Africa",
  "Egypt (مصر)",
  "Nigeria",
  "Kenya",
  "Morocco (المغرب)",
  "Tunisia (تونس)",
  "Ghana",
  "Ethiopia (ኢትዮጵያ)",
  "Tanzania",
  "Uganda",
  "Zambia",
  "Zimbabwe",

  // South America
  "Brazil (Brasil)",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru (Perú)",
  "Venezuela",
  "Ecuador",
  "Bolivia",
  "Paraguay",
  "Uruguay",
];

// Immigration type options based on selected country
const immigrationOptions = {
    'Canada': [
        { value: "LMIA Canada Program", label: "LMIA Canada Program" },
        { value: "AIPP Program", label: "AIPP Program" },
        { value: "SINP", label: "SINP (Saskatchewan)" },
        { value: "Canada Business Visa", label: "Canada Business Visa" },
        { value: "Canada Spouse Visa", label: "Canada Spouse Visa" },
        { value: "Canada Work Permit", label: "Canada Work Permit" },
        { value: "Express Entry", label: "Express Entry" },
        { value: "PNP Canada", label: "PNP Canada" },
        { value: "YCP Program", label: "YCP Program" }
    ],
    'UAE/Dubai': [
        { value: "Dubai Freelance Visa", label: "Dubai Freelance Visa" },
        { value: "UAE Visit Visa", label: "UAE Visit Visa" }
    ],
    'UK': [
        { value: "UK COS Program", label: "UK COS Program" },
        { value: "UK Innovator Visa", label: "UK Innovator Visa" },
        { value: "UK Sole Representative", label: "UK Sole Representative" },
        { value: "UK Startup Visa", label: "UK Startup Visa" },
        { value: "UK Study Visa", label: "UK Study Visa" },
        { value: "UK Visit Visa", label: "UK Visit Visa" }
    ],
    'LUXEMBOURG': [
        { value: "Luxembourg Work Visa", label: "Luxembourg Work Visa" },
        { value: "Luxembourg Visit Visa", label: "Luxembourg Visit Visa" }
    ],
    'GERMANY': [
        { value: "Germany Job Seeker", label: "Germany Job Seeker" },
        { value: "Germany Blue Card", label: "Germany Blue Card" }
    ],
    'PORTUGAL': [
        { value: "Portugal Golden Visa", label: "Portugal Golden Visa" },
        { value: "PORTUGAL D7 VISA", label: "PORTUGAL D7 VISA" }
    ],
    'MALTA': [
        { value: "Malta Global Residence", label: "Malta Global Residence" },
        { value: "Malta Work Visa", label: "Malta Work Visa" }
    ],
    'POLAND': [
        { value: "Poland Business Visa", label: "Poland Business Visa" },
        { value: "Poland Work Permit", label: "Poland Work Permit" }
    ],
    'NETHERLANDS': [
        { value: "Netherlands Startup Visa", label: "Netherlands Startup Visa" },
        { value: "Netherlands Highly Skilled Migrant Visa", label: "Netherlands Highly Skilled Migrant Visa" },
        { value: "Netherlands Work Visa", label: "Netherlands Work Visa" }
    ],
    'default': [
        { value: "Visit Visa", label: "Visit Visa" },
        { value: "Work Permit", label: "Work Permit" },
        { value: "Business Visa", label: "Business Visa" },
        { value: "Student Visa", label: "Student Visa" }
    ]
};
