// Function to convert a string to camelCase
export function toCamelCase(str) {
    return str
        .replace(/[^a-zA-Z\s]/g, '') // Remove non-alphabetic characters (except spaces)
        .replace(/[-()]/g, ' ') // Replace hyphens and parentheses with spaces
        .trim() // Remove leading and trailing whitespace
        .split(/\s+/) // Split by spaces (including multiple spaces)
        .map((word, index) =>
            index === 0
                ? word.toLowerCase() // First word in lowercase
                : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() // Capitalize subsequent words
        )
        .join(''); // Join words into a single camelCase string
}

// Function to filter roles that are true
export function trueVal({ rolesData }) {
    // Check if rolesData is defined and is an object
    if (!rolesData || typeof rolesData !== 'object') {
        console.warn("Invalid rolesData:", rolesData);
        return {}; // Return an empty object if rolesData is invalid
    }

    const trueRoles = Object.entries(rolesData)
        .filter(([key, value]) => value === true) // Keep only those with value: true
        .reduce((acc, [key]) => {
            acc[key] = true; // Rebuild the object with true values
            return acc;
        }, {});

    return trueRoles; // Return the filtered object
}
export const cleanFormData = (formData) => {
    return Object.entries(formData)
        .reduce((acc, [key, value]) => {
            if (value?.otherPreferences) {
                acc[key] = value; // Keep the entire entry if otherPreferences is defined
            } else {
                acc[key] = { option: value?.option }; // Only keep the option array if otherPreferences is undefined
            }
            return acc;
        }, {});
};
export const cleanFormData1 = (formData, val) => {
    return Object.entries(formData).reduce((acc, [key, value]) => {
        // Check if otherPreferences is undefined, null, or has no values
        const eqCon = val ? val : 'otherPreferences'
        if (key !== eqCon || (value && value.length > 0)) {
            acc[key] = value;
        }
        return acc;
    }, {});
};

export const formatSentence = (str) => {
    return str
        .replace(/([A-Z])/g, ' $1') // Insert space before each uppercase letter
        .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize the first letter of each word
        .trim(); // Remove any leading or trailing spaces
};

export const customFormat = (str) => {
    let formatted = formatSentence(str)
        .replace('Yes I Have A', '') // Remove 'I have a'
        .replace('Yes I Have', '')
        .replace('Yes I Can', '')
        .replace('Yes, But', '')
        .replace('Yes,', '')
        .replace('.', '')
        .replace('No I Am', 'I am')// Make 'I have' lowercase for other instances
        .replace('I Have Hands On', 'I have hands-on')
        .replace('And', ',')// Adjust hands-on
        .replace('Handson', 'hands-on') // Correct 'hands-on'
        .replace('Cpr', 'CPR')
        .replace('Certifications', 'certification'); // Adjust plural to singular

    // Apply specific custom rules
    if (formatted.startsWith('Yes')) {
        return formatted.replace('Yes, I have', 'Yes').trim() + ','; // Remove 'I have' and add a comma
    } else if (formatted.startsWith('No')) {
        return formatted.replace('No ', 'No ') + '.'; // Add a period for 'No' case
    }
    return formatted.trim(); // Trim any extra spaces
};

export function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
    });
}

export function formatTimeDate(isoString, timeZone) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',

        // timeZoneName: 'short'
    });
}

export function timeAgo(isoString) {
    const now = new Date();
    const pastDate = new Date(isoString);

    // Difference in milliseconds
    const diffInMs = now - pastDate;

    // Convert to time units
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30); // Approximate month
    const diffInYears = Math.floor(diffInDays / 365); // Approximate year

    // Handle "Now"
    if (diffInSeconds <= 10) {
        return "Now";
    }

    // Handle "Today"
    if (diffInDays === 0) {
        return "Today";
    }

    // Handle "Yesterday"
    if (diffInDays === 1) {
        return "Yesterday";
    }

    // Handle days < 30
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }

    // Handle months < 12
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
    }

    // Handle years
    return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}