// Configuration
const AUTH_ENDPOINTS = {
  config: '/api/auth/get-client-id',
  verify: '/api/auth/google'
};

// Main initialization function
async function initializeGoogleAuth() {
  try {
    // 1. Get configuration from server
    const { clientId } = await fetchAuthConfig();
    
    // 2. Load Google API script
    await loadGoogleScript();
    
    // 3. Initialize and render button
    initGoogleAuth(clientId);
    
  } catch (error) {
    console.error('Auth initialization failed:', error);
    showErrorToUser();
  }
}

// Fetch auth configuration from server
async function fetchAuthConfig() {
  const response = await fetch(AUTH_ENDPOINTS.config);
  if (!response.ok) throw new Error('Failed to fetch auth config');
  return await response.json();
}

// Dynamically load Google's library
function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Initialize Google Auth
function initGoogleAuth(clientId) {
  if (!window.google) throw new Error('Google library not loaded');
  
  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
    auto_select: false,
    ux_mode: 'popup'
  });

  renderSignInButton();
}

// Render the sign-in button
function renderSignInButton() {
  google.accounts.id.renderButton(
    document.getElementById("googleSignInContainer"),
    {
      type: "standard",
      size: "large",
      theme: "outline",
      text: "signin_with",
      width: "240"
    }
  );
}

// Handle the auth response
async function handleCredentialResponse(response) {
  try {
    const verification = await verifyToken(response.credential);
    console.log('Verification result:', verification);
    if (verification.success && verification.user?.email) {
      const email = verification.user.email;
      localStorage.setItem('userEmail', email); // ✅ Save to localStorage
      console.log('User logged in:', email);

      // Optional: redirect or update UI
      window.location.href = "/"; // or "userdata.html", based on your logic
    } else {
      throw new Error('User info missing or verification failed');
    }
    // Handle successful login (redirect or update UI)
  } catch (error) {
    console.error('Verification failed:', error);
    showErrorToUser();
  }
}

// Send token to server for verification
async function verifyToken(credential) {
  const response = await fetch(AUTH_ENDPOINTS.verify, {
    method: 'POST',
    headers: { 'Content-Type': 'application/client-json' },
    body: JSON.stringify({ credential })
  });
  if (!response.ok) throw new Error('Verification failed');
  return await response.json();
}

// Error handling UI
function showErrorToUser() {
  const container = document.getElementById('googleSignInContainer');
  container.innerHTML = '<p class="error">Login failed. Please try again.</p>';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGoogleAuth);