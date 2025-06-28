// Check user authentication and redirect accordingly
async function checkAuthAndRedirect() {
    const userEmail = localStorage.getItem('userEmail');
    const userId = localStorage.getItem('userId');
    
    if (!userEmail || !userId) {
        // Show loader before redirect
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.display = 'flex';
            // Wait for a short moment to show the loader
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        // No user email found, redirect to signup
        window.location.href = '/signup';
        return;
    }

    try {
        // Check if user exists in database
        const response = await fetch(`/api/user/check-user/${userEmail}`);
        const data = await response.json();

        const currentPath = window.location.pathname;

        if (!data.exists) {
            // User doesn't exist in database (new user)
            if (currentPath !== '/userdata') {
                window.location.href = '/userdata';
            }
        } else if (currentPath === '/signup' || currentPath === '/userdata') {
            // Existing user shouldn't access signup or userdata pages
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error checking user status:', error);
        // On error, redirect to signup
        window.location.href = '/signup';
    }
}

// Run check when DOM is loaded
document.addEventListener('DOMContentLoaded', checkAuthAndRedirect);
