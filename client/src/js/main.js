import { renderLoginPage, renderSwipePage } from './ui.js';
import { handleLoginSubmit } from './auth.js';
import { initializeSwipe } from './swipe.js';
import { connectSocket } from './socket.js';

const appRoot = document.getElementById('app-root');

// This object maps URL paths to functions that render the page
const routes = {
    '/': renderSwipePage,
    '/login': renderLoginPage,
    // You can add more routes like '/register' here
};

// This is our main router function
function router() {
    // Ensure the main app container exists
    if (!appRoot) {
        console.error("Fatal Error: #app-root element not found.");
        return;
    }

    let path = window.location.pathname;
    const token = localStorage.getItem('authToken');

    // --- Authentication Logic ---
    // If the user has no token and is not on the login page, force them to the login page.
    if (!token && path !== '/login') {
        console.log("No token found, redirecting to login.");
        // Change the URL without reloading the page
        window.history.pushState({}, '', '/login');
        path = '/login'; // Update the path to render the correct page
    }

    // If the user HAS a token but is on the login page, send them to the main app.
    if (token && path === '/login') {
        console.log("Token found, redirecting to swipe page.");
        window.history.pushState({}, '', '/');
        path = '/';
    }

    // Find the correct rendering function from our routes object.
    // If the path isn't found, default to the login page.
    const renderPage = routes[path] || renderLoginPage;

    // Clear the app container and render the new page
    appRoot.innerHTML = '';
    renderPage(appRoot); // This calls either renderLoginPage() or renderSwipePage()

    // After rendering, attach the necessary event listeners for that page
    addEventListeners(path);
}

function addEventListeners(path) {
    if (path === '/login') {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLoginSubmit);
        }
    } else if (path === '/') {
        // Only initialize swipe and sockets if on the main page
        initializeSwipe();
        // You would uncomment this once you have a userId
        // const userId = localStorage.getItem('userId');
        // if (userId) {
        //     connectSocket(userId);
        // }
    }
}

// Listen for browser back/forward button clicks
window.addEventListener('popstate', router);

// This is the initial entry point when the page first loads
document.addEventListener('DOMContentLoaded', router);
