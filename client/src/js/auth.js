import { login } from './api.js';

// The "export" keyword here is crucial. It makes this function
// available to be imported by other files, like main.js.
export async function handleLoginSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
        const response = await login(email, password);
        const { token, _id } = response.data;

        // Store user info in localStorage for session persistence
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', _id);

        // This is a clean way to re-render the page without a full reload.
        // It tells our router to check the URL again.
        window.history.pushState({}, '', '/');
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);

    } catch (error) {
        console.error('Login failed:', error);
        // Provide user-friendly feedback
        alert('Login failed. Please check your email and password.');
    }
}

