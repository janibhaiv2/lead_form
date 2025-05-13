// Initialize Supabase client
const SUPABASE_URL = 'https://fbhaattnnpjbwqoqhzdc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiaGFhdHRubnBqYndxb3FoemRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3MDkwNTgsImV4cCI6MjA2MjI4NTA1OH0.n0JVcKfxY6OBsO7_fsG6mBSiyTfglr3kJAcPuv3UPvc';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Campaign tracking parameters
let campaignData = {
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_content: '',
    utm_term: '',
    fbclid: ''
};

// Function to get URL parameters
function getURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);

    // Get campaign tracking parameters
    campaignData.utm_source = urlParams.get('utm_source') || '';
    campaignData.utm_medium = urlParams.get('utm_medium') || '';
    campaignData.utm_campaign = urlParams.get('utm_campaign') || '';
    campaignData.utm_content = urlParams.get('utm_content') || '';
    campaignData.utm_term = urlParams.get('utm_term') || '';
    campaignData.fbclid = urlParams.get('fbclid') || '';

    console.log('Campaign data:', campaignData);

    // Check if Meta Pixel is loaded
    if (typeof fbq === 'undefined') {
        console.error('Meta Pixel (fbq) is not defined. Trying to reload...');
        // Try to reload the Meta Pixel
        loadMetaPixel();
    } else {
        console.log('Meta Pixel is loaded and ready');
    }
}

// Function to load Meta Pixel if it's not already loaded
function loadMetaPixel() {
    try {
        console.log('Attempting to load Meta Pixel manually...');
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');

        fbq('init', '1232706385105571', {}, {debug: true});
        fbq('track', 'PageView');
        console.log('Meta Pixel loaded manually');
    } catch (error) {
        console.error('Failed to load Meta Pixel manually:', error);
    }
}

// Function to track lead events with Meta Pixel
function trackLeadEvent(formData) {
    console.log('Tracking lead event with Meta Pixel...');

    try {
        // Prepare Meta Pixel event parameters
        const pixelParams = {
            content_name: 'Immigration Lead Form',
            content_category: formData.immigrationType || 'Not Specified',
            currency: 'USD',
            value: 1.00,
            country: formData.migrateCountry || 'Not Specified',
            status: 'submitted'
        };

        // Add campaign data to pixel parameters if available
        if (campaignData.utm_source) pixelParams.utm_source = campaignData.utm_source;
        if (campaignData.utm_medium) pixelParams.utm_medium = campaignData.utm_medium;
        if (campaignData.utm_campaign) pixelParams.utm_campaign = campaignData.utm_campaign;
        if (campaignData.fbclid) pixelParams.fbclid = campaignData.fbclid;

        // Send Lead event to Meta Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', pixelParams);
            console.log('Meta Pixel Lead event sent with params:', pixelParams);

            // Send a backup standard event in case the Lead event doesn't work
            fbq('trackCustom', 'FormSubmission', pixelParams);
            console.log('Meta Pixel FormSubmission event sent as backup');
        } else {
            console.error('fbq is still undefined when trying to track lead');
        }
    } catch (error) {
        console.error('Error tracking lead event:', error);
    }
}

// Global state for active dropdown
let activeDropdown = null;

// DOM Elements
const contactForm = document.getElementById('contactForm');
const nationalitySelect = document.getElementById('nationality');
const currentCountrySelect = document.getElementById('currentCountry');
const migrateCountrySelect = document.getElementById('migrateCountry');
const immigrationTypeSelect = document.getElementById('immigrationType');
const immigrationTypeContainer = document.querySelector('[data-select-name="immigrationType"]');
const phoneInput = document.getElementById('phone');
const whatsappInput = document.getElementById('whatsapp');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popupMessage');
const submitButton = document.querySelector('.submit-button');
const validationStatus = document.getElementById('validation-status');

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
            // Validate form
            validateForm();
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
            // Validate form
            validateForm();
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

            // Debug log
            console.log(`Selected migrate country: ${country}`);

            // Enable the immigration type dropdown
            toggleImmigrationTypeDropdown(true);

            // Update immigration type options when migrate country changes
            updateImmigrationOptions(country);

            // Validate form
            validateForm();
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

    // Check if immigrationOptions is defined
    if (typeof immigrationOptions === 'undefined') {
        console.error('immigrationOptions is not defined. Using default options.');
        // Create default options if immigrationOptions is not defined
        const defaultOptions = [
            { value: "Visit Visa", label: "Visit Visa" },
            { value: "Work Permit", label: "Work Permit" },
            { value: "Business Visa", label: "Business Visa" },
            { value: "Student Visa", label: "Student Visa" }
        ];

        // Add default options directly
        defaultOptions.forEach(option => {
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
                // Validate form
                validateForm();
            });
            immigrationTypeOptions.appendChild(immigrationOption);
        });
        return;
    }

    // Default options if immigrationOptions is available but no match is found
    const defaultOptions = [
        { value: "Visit Visa", label: "Visit Visa" },
        { value: "Work Permit", label: "Work Permit" },
        { value: "Business Visa", label: "Business Visa" },
        { value: "Student Visa", label: "Student Visa" }
    ];

    // Use default options
    let options = defaultOptions;

    try {
        // Try to get options from countries.js if it's loaded
        if (typeof window.immigrationOptions !== 'undefined') {
            // Try to get country-specific options
            const countryKey = Object.keys(window.immigrationOptions).find(
                key => key.toLowerCase() === selectedCountry.toLowerCase()
            );

            if (countryKey) {
                options = window.immigrationOptions[countryKey];
                console.log(`Found immigration options for: ${countryKey}`);
            } else if (window.immigrationOptions['default']) {
                options = window.immigrationOptions['default'];
                console.log(`No specific immigration options found for: ${selectedCountry}, using default options`);
            }
        } else {
            console.log('immigrationOptions not found in global scope, using hardcoded defaults');
        }
    } catch (error) {
        console.error('Error finding immigration options:', error);
    }

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
            // Validate form
            validateForm();
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

    // Add campaign data as a JSON string in a notes field if it exists
    // This avoids the need to add new columns to the database
    if (Object.values(campaignData).some(value => value !== '')) {
        // Store campaign data as JSON in the notes field
        formData.notes = JSON.stringify({
            campaign_data: campaignData
        });
    }

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

        // Track lead conversion with Meta Pixel
        try {
            // Check if Meta Pixel is loaded
            if (typeof fbq === 'undefined') {
                console.error('Meta Pixel (fbq) is not defined when trying to track Lead. Reloading...');
                loadMetaPixel();
                // Wait a moment for the pixel to load
                setTimeout(() => {
                    trackLeadEvent(formData);
                }, 500);
            } else {
                trackLeadEvent(formData);
            }
        } catch (pixelError) {
            console.error('Meta Pixel tracking error:', pixelError);
        }

        showPopup("Thank you for beginning your immigration journey with us! We'll contact you soon.");

        // Reset form
        contactForm.reset();

        // Reset dropdown displays
        document.querySelector('[data-select-name="nationality"] .selected-value').textContent = 'Select Nationality';
        document.querySelector('[data-select-name="currentCountry"] .selected-value').textContent = 'Select Current Country';
        document.querySelector('[data-select-name="migrateCountry"] .selected-value').textContent = 'Select Country';
        document.querySelector('[data-select-name="immigrationType"] .selected-value').textContent = 'Select Immigration Type';

        // Disable immigration type dropdown again
        toggleImmigrationTypeDropdown(false);

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
        filteredCountries.forEach(country => {
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

    // Validate form after country selection
    validateForm();
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

    // Validate form after phone number change
    validateForm();
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

            console.log(`Clicked on dropdown: ${selectName}`);

            // Check if this is the immigration type dropdown and it's disabled
            if (selectName === 'immigrationType' && container.classList.contains('disabled')) {
                console.log('Immigration type dropdown is disabled');
                // Show a popup message
                showPopup('Please select a Migrate Country first', true);
                return; // Don't open the dropdown
            }

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

            console.log(`Dropdown ${selectName} is now ${dropdown.classList.contains('active') ? 'active' : 'inactive'}`);

            // Focus search input if dropdown is open and exists
            if (dropdown.classList.contains('active') && searchInput) {
                searchInput.focus();
                searchInput.value = '';
                // Show all options
                const options = optionsList.querySelectorAll('.option');
                options.forEach(option => {
                    option.style.display = 'block';
                });
            }
        });

        // Filter options on search input (if it exists)
        if (searchInput) {
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
        }

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

// Function to disable/enable immigration type dropdown
function toggleImmigrationTypeDropdown(enable = false) {
    if (enable) {
        // Enable the dropdown
        immigrationTypeContainer.classList.remove('disabled');

        // Remove the disabled message if it exists
        const existingMessage = immigrationTypeContainer.querySelector('.disabled-message');
        if (existingMessage) {
            existingMessage.remove();
        }
    } else {
        // Disable the dropdown
        immigrationTypeContainer.classList.add('disabled');

        // Add a message if it doesn't exist
        if (!immigrationTypeContainer.querySelector('.disabled-message')) {
            const disabledMessage = document.createElement('div');
            disabledMessage.className = 'disabled-message';
            disabledMessage.textContent = 'Please select a Migrate Country first';
            immigrationTypeContainer.appendChild(disabledMessage);
        }
    }
}

// Function to validate all form fields
function validateForm() {
    let isValid = true;
    let firstInvalidField = null;
    const requiredFields = [
        { id: 'name', label: 'Name' },
        { id: 'email', label: 'Email' },
        { id: 'age', label: 'Age', minValue: 22 },
        { id: 'currentOccupation', label: 'Current Occupation' },
        { id: 'education', label: 'Education' },
        { id: 'nationality', label: 'Nationality' },
        { id: 'currentCountry', label: 'Current Country' },
        { id: 'migrateCountry', label: 'Migrate Country' },
        { id: 'immigrationType', label: 'Immigration Type' }
    ];

    // Clear previous error messages
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.invalid-field').forEach(el => el.classList.remove('invalid-field'));

    // Validate each required field
    requiredFields.forEach(field => {
        const element = document.getElementById(field.id);
        const value = element.value.trim();

        // Check if field is empty
        if (!value) {
            isValid = false;

            // Find the appropriate container to add error message
            let container;
            if (field.id === 'nationality' || field.id === 'currentCountry' ||
                field.id === 'migrateCountry' || field.id === 'immigrationType') {
                container = document.querySelector(`[data-select-name="${field.id}"]`);
                container.querySelector('.select-button').classList.add('invalid-field');
            } else {
                container = element.parentElement;
                element.classList.add('invalid-field');
            }

            // Add error message if it doesn't exist
            if (!container.querySelector('.field-error')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'field-error';
                errorMessage.textContent = `${field.label} is required`;
                container.appendChild(errorMessage);
            }

            // Store first invalid field for scrolling
            if (!firstInvalidField) {
                firstInvalidField = container;
            }
        }

        // Check minimum value for age
        if (field.id === 'age' && value && parseInt(value) < field.minValue) {
            isValid = false;
            const container = element.parentElement;
            element.classList.add('invalid-field');

            // Add error message if it doesn't exist
            if (!container.querySelector('.field-error')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'field-error';
                errorMessage.textContent = `Age must be at least ${field.minValue} years`;
                container.appendChild(errorMessage);
            }

            if (!firstInvalidField) {
                firstInvalidField = container;
            }
        }

        // Validate email format
        if (field.id === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                const container = element.parentElement;
                element.classList.add('invalid-field');

                // Add error message if it doesn't exist
                if (!container.querySelector('.field-error')) {
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'field-error';
                    errorMessage.textContent = 'Please enter a valid email address';
                    container.appendChild(errorMessage);
                }

                if (!firstInvalidField) {
                    firstInvalidField = container;
                }
            }
        }
    });

    // Validate phone numbers
    const phoneMaxDigits = phoneSelectedCountry.format.split('').filter(char => char === 'X').length;
    if (!phoneNumber || phoneNumber.length < phoneMaxDigits) {
        isValid = false;
        const container = phoneInput.parentElement.parentElement;
        phoneInput.classList.add('invalid-field');

        // Add error message if it doesn't exist
        if (!container.querySelector('.field-error')) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'field-error';
            errorMessage.textContent = `Please enter a valid ${phoneSelectedCountry.country} phone number`;
            container.appendChild(errorMessage);
        }

        if (!firstInvalidField) {
            firstInvalidField = container;
        }
    }

    // Validate WhatsApp number
    const whatsappMaxDigits = whatsappSelectedCountry.format.split('').filter(char => char === 'X').length;
    if (!whatsappNumber || whatsappNumber.length < whatsappMaxDigits) {
        isValid = false;
        const container = whatsappInput.parentElement.parentElement;
        whatsappInput.classList.add('invalid-field');

        // Add error message if it doesn't exist
        if (!container.querySelector('.field-error')) {
            const errorMessage = document.createElement('div');
            errorMessage.className = 'field-error';
            errorMessage.textContent = `Please enter a valid ${whatsappSelectedCountry.country} WhatsApp number`;
            container.appendChild(errorMessage);
        }

        if (!firstInvalidField) {
            firstInvalidField = container;
        }
    }

    // Update submit button only
    submitButton.disabled = !isValid;

    // Don't show validation status message
    validationStatus.style.display = 'none';

    return isValid;
}

// Function to add input event listeners to all form fields
function addFormValidationListeners() {
    // Add listeners to text inputs
    const textInputs = ['name', 'email', 'age', 'currentOccupation'];
    textInputs.forEach(id => {
        const element = document.getElementById(id);
        element.addEventListener('input', validateForm);
        element.addEventListener('blur', validateForm);
    });

    // Add listener to education select
    document.getElementById('education').addEventListener('change', validateForm);

    // Phone and WhatsApp inputs already have listeners that update their values
    // We'll modify those handlers to call validateForm

    // For custom dropdowns, we need to modify the click handlers when options are selected
    // This is done in the respective event listeners in populateCountryDropdowns
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Get URL parameters for campaign tracking
    getURLParameters();

    // Populate country dropdowns
    populateCountryDropdowns();

    // Initialize country dropdowns with search
    initializeCountryDropdowns();

    // Initially disable the immigration type dropdown
    toggleImmigrationTypeDropdown(false);

    // Add validation listeners to form fields
    addFormValidationListeners();

    // Initial validation
    validateForm();

    // Add event listener for form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validate form before submission
        if (validateForm()) {
            handleSubmit(e);
        }
        // No error popup if validation fails
    });
});
