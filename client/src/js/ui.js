import { getPotentialMatches } from './api.js';

// --- Helper Functions ---

function createCardHTML(user) {
    // Calculate age safely
    const dob = new Date(user.profile.dob);
    const age = new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970;

    // Use a placeholder image if no photo is available
    const photoUrl = user.profile.photos?.[0] || 'https://placehold.co/400x600/fbcfe8/333?text=No+Photo';

    return `
        <div class="card" data-user-id="${user._id}" style="background-image: url('${photoUrl}')">
            <div class="info">
                <h3>${user.username || 'Unknown'}, ${age || ''}</h3>
                <p>${(user.profile.bio || '').substring(0, 100)}</p>
            </div>
        </div>
    `;
}

// --- Page Rendering Functions ---

export function renderLoginPage(container) {
    const template = document.getElementById('login-template');
    if (!template) {
        container.innerHTML = '<h2>Error: Login template not found.</h2>';
        return;
    }
    const content = template.content.cloneNode(true);
    container.appendChild(content);
}

export async function renderSwipePage(container) {
    const template = document.getElementById('swipe-template');
    if (!template) {
        container.innerHTML = '<h2>Error: Swipe template not found.</h2>';
        return;
    }
    const content = template.content.cloneNode(true);
    container.appendChild(content);
    
    const cardStack = container.querySelector('.card-stack');
    if (!cardStack) {
        console.error("Could not find .card-stack element in swipe template.");
        return;
    }
    
    try {
        const res = await getPotentialMatches();
        if (res.data && res.data.length > 0) {
            // Render cards in reverse order so the first one is on top
            res.data.reverse().forEach(user => {
                cardStack.innerHTML += createCardHTML(user);
            });
        } else {
            cardStack.innerHTML = '<p class="empty-state">No new profiles right now. Check back later!</p>';
        }
    } catch (error) {
        console.error("Failed to get potential matches:", error);
        cardStack.innerHTML = '<p class="empty-state">Could not load profiles. Please try again.</p>';
        // This could be an auth error. Maybe the token expired.
        if (error.response && error.response.status === 401) {
            // Token is invalid, log the user out.
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            window.location.href = '/login'; // Force a reload to the login page
        }
    }
}
