// Initialize Supabase client
const SUPABASE_URL = 'https://fbhaattnnpjbwqoqhzdc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiaGFhdHRubnBqYndxb3FoemRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MDkwNTgsImV4cCI6MjA2MjI4NTA1OH0.n0JVcKfxY6OBsO7_fsG6mBSiyTfglr3kJAcPuv3UPvc';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global state for active dropdown
let activeDropdown = null;

// DOM Elements
const contactForm = document.getElementById('contactForm');
const nationalitySelect = document.getElementById('nationality');
const currentCountrySelect = document.getElementById('currentCountry');
const migrateCountrySelect = document.getElementById('migrateCountry');
const immigrationTypeSelect = document.getElementById('immigrationType');
const phoneInput = document.getElementById('phone');
const whatsappInput = document.getElementById('whatsapp');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');

// Phone input state
let phoneSelectedCountry = null;
let phoneNumber = '';
let whatsappSelectedCountry = null;
let whatsappNumber = '';

// Format phone number based on country format
function formatPhoneNumber(number, format) {
    let formattedNumber = '';
    let numberIndex = 0;

    // If no number, return empty string
    if (!number || number.length === 0) {
        return '';
    }

    for (let i = 0; i < format.length && numberIndex < number.length; i++) {
        if (format[i] === 'X') {
            formattedNumber += number[numberIndex] || '';
            numberIndex++;
        } else {
            formattedNumber += format[i];
        }
    }

    // Add any remaining digits
    if (numberIndex < number.length) {
        formattedNumber += number.substring(numberIndex);
    }

    return formattedNumber;
}

// Populate country dropdowns
function populateCountryDropdowns() {
    // Get the options lists
    const nationalityOptions = document.querySelector('[data-select-name="nationality"] .options-list');
    const currentCountryOptions = document.querySelector('[data-select-name="currentCountry"] .options-list');
    const migrateCountryOptions = document.querySelector('[data-select-name="migrateCountry"] .options-list');

    // Clear existing options
    nationalityOptions.innerHTML = '';
    currentCountryOptions.innerHTML = '';
    migrateCountryOptions.innerHTML = '';

    // Populate nationality and current country dropdowns
    countries.forEach(country => {
        // Create option for nationality
        const nationalityOption = document.createElement('div');
        nationalityOption.className = 'option';
        nationalityOption.textContent = country;
        nationalityOption.setAttribute('data-value', country);
        nationalityOption.addEventListener('click', function() {
            // Update hidden input
            document.getElementById('nationality').value = country;
            // Update display
            document.querySelector('[data-select-name="nationality"] .selected-value').textContent = country;
            // Close dropdown
            document.querySelector('[data-select-name="nationality"] .dropdown').classList.remove('active');
            activeDropdown = null;
        });
        nationalityOptions.appendChild(nationalityOption);

        // Create option for current country
        const currentCountryOption = document.createElement('div');
        currentCountryOption.className = 'option';
        currentCountryOption.textContent = country;
        currentCountryOption.setAttribute('data-value', country);
        currentCountryOption.addEventListener('click', function() {
            // Update hidden input
            document.getElementById('currentCountry').value = country;
            // Update display
            document.querySelector('[data-select-name="currentCountry"] .selected-value').textContent = country;
            // Close dropdown
            document.querySelector('[data-select-name="currentCountry"] .dropdown').classList.remove('active');
            activeDropdown = null;
        });
        currentCountryOptions.appendChild(currentCountryOption);
    });

    // Populate migrate country dropdown with specific countries
    const migrateCountries = [
        "Canada",
        "UAE/Dubai",
        "UK",
        "LUXEMBOURG",
        "GERMANY",
        "PORTUGAL",
        "MALTA",
        "POLAND",
        "NETHERLANDS"
    ];

    migrateCountries.forEach(country => {
        const migrateOption = document.createElement('div');
        migrateOption.className = 'option';
        migrateOption.textContent = country;
        migrateOption.setAttribute('data-value', country);
        migrateOption.addEventListener('click', function() {
            // Update hidden input
            document.getElementById('migrateCountry').value = country;
            // Update display
            document.querySelector('[data-select-name="migrateCountry"] .selected-value').textContent = country;
            // Close dropdown
            document.querySelector('[data-select-name="migrateCountry"] .dropdown').classList.remove('active');
            activeDropdown = null;

            // Update immigration type options when migrate country changes
            updateImmigrationOptions(country);
        });
        migrateCountryOptions.appendChild(migrateOption);
    });

    // Initialize phone country selectors
    initializePhoneCountrySelectors();
}

// Update immigration type options based on selected country
function updateImmigrationOptions(selectedCountry) {
    // Get the options list
    const immigrationTypeOptions = document.querySelector('[data-select-name="immigrationType"] .options-list');

    // Clear existing options
    immigrationTypeOptions.innerHTML = '';

    // Reset the hidden input and display text
    document.getElementById('immigrationType').value = '';
    document.querySelector('[data-select-name="immigrationType"] .selected-value').textContent = 'Select Immigration Type';

    // Get options for selected country or default options
    const options = immigrationOptions[selectedCountry] || immigrationOptions['default'];

    // Add options to dropdown
    options.forEach(option => {
        const immigrationOption = document.createElement('div');
        immigrationOption.className = 'option';
        immigrationOption.textContent = option.label;
        immigrationOption.setAttribute('data-value', option.value);
        immigrationOption.addEventListener('click', function() {
            // Update hidden input
            document.getElementById('immigrationType').value = option.value;
            // Update display
            document.querySelector('[data-select-name="immigrationType"] .selected-value').textContent = option.label;
            // Close dropdown
            document.querySelector('[data-select-name="immigrationType"] .dropdown').classList.remove('active');
            activeDropdown = null;
        });
        immigrationTypeOptions.appendChild(immigrationOption);
    });
}

// Show popup message
function showPopup(message, isError = false) {
    popupMessage.textContent = message;
    popup.classList.add(isError ? 'error' : 'success');

    // Hide popup after 3 seconds
    setTimeout(() => {
        popup.classList.remove('error', 'success');
    }, 3000);
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: phoneSelectedCountry.code + ' ' + formatPhoneNumber(phoneNumber, phoneSelectedCountry.format),
        whatsapp: whatsappSelectedCountry.code + ' ' + formatPhoneNumber(whatsappNumber, whatsappSelectedCountry.format),
        nationality: document.getElementById('nationality').value,
        currentCountry: document.getElementById('currentCountry').value,
        migrateCountry: document.getElementById('migrateCountry').value,
        age: document.getElementById('age').value,
        currentOccupation: document.getElementById('currentOccupation').value,
        education: document.getElementById('education').value,
        immigrationType: document.getElementById('immigrationType').value,
        created_at: new Date().toISOString(),
        source: 'lead-form'
    };

    // Validate age
    if (parseInt(formData.age) < 22) {
        showPopup("Age must be at least 22 years.", true);
        return;
    }

    // Validate phone number
    const phoneMaxDigits = phoneSelectedCountry.format.split('').filter(char => char === 'X').length;
    if (!phoneNumber || phoneNumber.length < phoneMaxDigits) {
        showPopup(`Please enter a valid ${phoneSelectedCountry.country} phone number (${phoneMaxDigits} digits required)`, true);
        return;
    }

    // Validate WhatsApp number
    const whatsappMaxDigits = whatsappSelectedCountry.format.split('').filter(char => char === 'X').length;
    if (!whatsappNumber || whatsappNumber.length < whatsappMaxDigits) {
        showPopup(`Please enter a valid ${whatsappSelectedCountry.country} WhatsApp number (${whatsappMaxDigits} digits required)`, true);
        return;
    }

    try {
        // Insert data into Supabase contacts table
        const { error } = await supabaseClient
            .from('contacts')
            .insert([formData]);

        if (error) {
            console.error('Supabase error:', error);
            showPopup("An error occurred. Please try again.", true);
            return;
        }

        console.log('Form data successfully inserted into Supabase contacts table');
        showPopup("Thank you for beginning your immigration journey with us! We'll contact you soon.");

        // Reset form
        contactForm.reset();

    } catch (error) {
        console.error('Submission error:', error);
        showPopup("An error occurred. Please try again.", true);
    }
}

// Initialize phone country selectors
function initializePhoneCountrySelectors() {
    // Get phone country selector elements
    const phoneCountrySelector = document.getElementById('phone-country');
    const whatsappCountrySelector = document.getElementById('whatsapp-country');

    // Set default country (first in the list)
    phoneSelectedCountry = countryCodes[0];
    whatsappSelectedCountry = countryCodes[0];

    // Update display of selected country
    updatePhoneCountryDisplay('phone');
    updatePhoneCountryDisplay('whatsapp');

    // Add event listeners for country selector clicks
    phoneCountrySelector.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCountryDropdown('phone');
    });

    whatsappCountrySelector.addEventListener('click', function(e) {
        e.preventDefault();
        toggleCountryDropdown('whatsapp');
    });

    // Add event listeners for phone input changes
    phoneInput.addEventListener('input', function(e) {
        handlePhoneNumberChange(e, 'phone');
    });

    whatsappInput.addEventListener('input', function(e) {
        handlePhoneNumberChange(e, 'whatsapp');
    });

    // Add event listeners for search inputs
    document.getElementById('phone-search').addEventListener('input', function(e) {
        handlePhoneSearchChange(e, 'phone');
    });

    document.getElementById('whatsapp-search').addEventListener('input', function(e) {
        handlePhoneSearchChange(e, 'whatsapp');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.phone-dropdown-container')) {
            closePhoneDropdown('phone');
        }
        if (!e.target.closest('.whatsapp-dropdown-container')) {
            closePhoneDropdown('whatsapp');
        }
    });
}

// Update phone country display
function updatePhoneCountryDisplay(type) {
    const country = type === 'phone' ? phoneSelectedCountry : whatsappSelectedCountry;
    const codeElement = document.getElementById(`${type}-code`);
    const countryElement = document.getElementById(`${type}-country-name`);
    const placeholderElement = document.getElementById(`${type}`);
    const formatHintElement = document.getElementById(`${type}-format-hint`);

    codeElement.textContent = country.code;
    countryElement.textContent = country.country;
    placeholderElement.placeholder = country.placeholder;
    formatHintElement.textContent = `Format: ${country.code} ${country.format.replace(/X/g, '0')}`;
}

// Toggle country dropdown
function toggleCountryDropdown(type) {
    const dropdownElement = document.getElementById(`${type}-dropdown`);
    const isOpen = dropdownElement.classList.contains('active');

    // Close all dropdowns first
    if (activeDropdown && activeDropdown !== type) {
        closePhoneDropdown(activeDropdown);
    }

    if (isOpen) {
        closePhoneDropdown(type);
    } else {
        // Open this dropdown
        dropdownElement.classList.add('active');
        activeDropdown = type;

        // Focus search input
        const searchInput = document.getElementById(`${type}-search`);
        if (searchInput) {
            searchInput.focus();
            searchInput.value = '';
            // Clear search results
            handlePhoneSearchChange({ target: { value: '' } }, type);
        }
    }
}

// Close phone dropdown
function closePhoneDropdown(type) {
    const dropdownElement = document.getElementById(`${type}-dropdown`);
    dropdownElement.classList.remove('active');
    if (activeDropdown === type) {
        activeDropdown = null;
    }
}

// Handle phone search change
function handlePhoneSearchChange(e, type) {
    const searchTerm = e.target.value.toLowerCase();
    const countryListElement = document.getElementById(`${type}-country-list`);

    // Clear current list
    countryListElement.innerHTML = '';

    // Filter countries
    const filteredCountries = searchTerm
        ? countryCodes.filter(country =>
            country.country.toLowerCase().includes(searchTerm) ||
            country.code.includes(searchTerm)
          )
        : countryCodes;

    // Add filtered countries to list
    if (filteredCountries.length > 0) {
        filteredCountries.forEach((country, index) => {
            const countryElement = document.createElement('div');
            countryElement.className = 'country-option';
            countryElement.innerHTML = `
                <span class="country-code">${country.code}</span>
                <span class="country-name">${country.country}</span>
            `;
            countryElement.addEventListener('click', function() {
                handleCountrySelect(country, type);
            });
            countryListElement.appendChild(countryElement);
        });
    } else {
        const noResultsElement = document.createElement('div');
        noResultsElement.className = 'no-results';
        noResultsElement.textContent = 'No countries found';
        countryListElement.appendChild(noResultsElement);
    }
}

// Handle country selection
function handleCountrySelect(country, type) {
    if (type === 'phone') {
        phoneSelectedCountry = country;
        phoneNumber = ''; // Reset phone number when country changes
        phoneInput.value = '';
    } else {
        whatsappSelectedCountry = country;
        whatsappNumber = ''; // Reset whatsapp number when country changes
        whatsappInput.value = '';
    }

    updatePhoneCountryDisplay(type);
    closePhoneDropdown(type);
}

// Handle phone number input
function handlePhoneNumberChange(e, type) {
    // Remove all non-numeric characters
    const numericValue = e.target.value.replace(/\D/g, '');

    const country = type === 'phone' ? phoneSelectedCountry : whatsappSelectedCountry;

    // Limit the length based on the selected country's format
    const maxDigits = country.format.split('').filter(char => char === 'X').length;

    // Only allow up to maxDigits
    const limitedValue = numericValue.slice(0, maxDigits);

    // Format the phone number
    const formatted = formatPhoneNumber(limitedValue, country.format);

    // Update state and input value
    if (type === 'phone') {
        phoneNumber = limitedValue; // Store raw number for validation
        phoneInput.value = formatted; // Display formatted number

        // Update format hint color based on validation
        const formatHint = document.getElementById('phone-format-hint');
        if (limitedValue.length === maxDigits) {
            formatHint.style.color = '#7cee6d'; // Green for valid
        } else {
            formatHint.style.color = ''; // Default color for invalid
        }
    } else {
        whatsappNumber = limitedValue; // Store raw number for validation
        whatsappInput.value = formatted; // Display formatted number

        // Update format hint color based on validation
        const formatHint = document.getElementById('whatsapp-format-hint');
        if (limitedValue.length === maxDigits) {
            formatHint.style.color = '#7cee6d'; // Green for valid
        } else {
            formatHint.style.color = ''; // Default color for invalid
        }
    }
}

// Initialize country dropdowns with search functionality
function initializeCountryDropdowns() {
    // Add event listeners for country dropdowns
    document.querySelectorAll('.country-select-container').forEach(container => {
        const selectButton = container.querySelector('.select-button');
        const dropdown = container.querySelector('.dropdown');
        const searchInput = container.querySelector('.search-input');
        const optionsList = container.querySelector('.options-list');
        const selectName = container.getAttribute('data-select-name');

        // Toggle dropdown on button click
        selectButton.addEventListener('click', function(e) {
            e.preventDefault();

            // Close other dropdowns
            if (activeDropdown && activeDropdown !== selectName) {
                document.querySelectorAll('.dropdown.active').forEach(d => {
                    if (d !== dropdown) {
                        d.classList.remove('active');
                    }
                });
            }

            // Toggle this dropdown
            dropdown.classList.toggle('active');
            activeDropdown = dropdown.classList.contains('active') ? selectName : null;

            // Focus search input if dropdown is open
            if (dropdown.classList.contains('active')) {
                searchInput.focus();
                searchInput.value = '';
                // Show all options
                const options = optionsList.querySelectorAll('.option');
                options.forEach(option => {
                    option.style.display = 'block';
                });
            }
        });

        // Filter options on search input
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const options = optionsList.querySelectorAll('.option');

            options.forEach(option => {
                const text = option.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) {
                dropdown.classList.remove('active');
                if (activeDropdown === selectName) {
                    activeDropdown = null;
                }
            }
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Populate country dropdowns
    populateCountryDropdowns();

    // Initialize country dropdowns with search
    initializeCountryDropdowns();

    // Add event listener for form submission
    contactForm.addEventListener('submit', handleSubmit);
});
