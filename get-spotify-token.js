// Spotify Refresh Token Generator
// Run this script to get your refresh token
// Make sure you have a .env file with SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET

require('dotenv').config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://127.0.0.1:3000/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('\n❌ ERROR: Missing environment variables!');
    console.error('Please create a .env file with SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET\n');
    process.exit(1);
}

// Step 1: Visit this URL in your browser (after filling in CLIENT_ID above)
const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-currently-playing user-read-playback-state`;

console.log('\n=== SPOTIFY REFRESH TOKEN GENERATOR ===\n');
console.log('Step 1: Replace YOUR_CLIENT_ID_HERE and YOUR_CLIENT_SECRET_HERE with your actual credentials\n');
console.log('Step 2: Visit this URL in your browser:\n');
console.log(authUrl);
console.log('\nStep 3: After authorizing, you\'ll be redirected to localhost:3000?code=...');
console.log('        Copy the "code" parameter from the URL\n');
console.log('Step 4: Run this script with the code:');
console.log('        node get-spotify-token.js YOUR_CODE_HERE\n');

// Get the authorization code from command line
const code = process.argv[2];

if (code && code !== 'YOUR_CODE_HERE') {
    // Exchange code for refresh token
    const getRefreshToken = async () => {
        const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
        
        const params = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI
        });

        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${basic}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            const data = await response.json();
            
            if (data.refresh_token) {
                console.log('\n✅ SUCCESS! Your refresh token is:\n');
                console.log(data.refresh_token);
                console.log('\n⚠️  Save this token securely! You\'ll need it for your .env file\n');
            } else {
                console.log('\n❌ Error:', data);
            }
        } catch (error) {
            console.error('\n❌ Error:', error);
        }
    };

    getRefreshToken();
}

