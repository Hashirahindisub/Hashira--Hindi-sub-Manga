// Configuration File
const CONFIG = {
    // Arollinks API
    AROLLINKS_API_KEY: '7f3db1cbf6409f49ac615f382d4c8260dc354812',
    AROLLINKS_API_URL: 'https://arollinks.com/api/link/shorten',
    
    // Google Drive Settings
    GOOGLE_DRIVE_FOLDER_ID: '', // Add your Google Drive folder ID here
    
    // Chapter Settings
    CHAPTERS_PER_PAYWALL: 10, // After reading 10 chapters, show paywall
    
    // Site Settings
    SITE_NAME: 'Hashira Hindi Sub Manga',
    SITE_URL: 'https://your-domain.com', // Update this
};

// Function to shorten URL using Arollinks
async function shortenURL(longURL) {
    try {
        const response = await fetch(CONFIG.AROLLINKS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.AROLLINKS_API_KEY}`
            },
            body: JSON.stringify({
                long_url: longURL,
                custom_alias: '',
                expires_at: null
            })
        });

        if (response.ok) {
            const data = await response.json();
            return data.short_url || data.shortened_url;
        } else {
            console.error('Failed to shorten URL:', response.statusText);
            return longURL;
        }
    } catch (error) {
        console.error('Error shortening URL:', error);
        return longURL;
    }
}

// Function to verify shortened link
async function verifyLink(shortenedURL) {
    try {
        const response = await fetch(shortenedURL, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.error('Error verifying link:', error);
        return false;
    }
}
