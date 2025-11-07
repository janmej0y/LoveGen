# LoveGen - Modern Dating Web Application

LoveGen is a full-stack, responsive dating website built with modern technologies. It aims to connect users based on compatibility, interests, and location, featuring a swipe-based matching system and real-time chat.

## Features
- 👤 **User Authentication**: Secure JWT-based auth, social logins, and email verification.
- 🎨 **Dynamic Profiles**: Customizable profiles with photo galleries, interests, and bios.
- ❤️ **Swipe & Match**: Tinder-like card swiping interface to like or dislike profiles.
- 💬 **Real-time Chat**: Instant messaging with matches using Socket.io.
- ⚙️ **Advanced Search**: Filter potential matches by age, distance, and interests.
- ⭐ **Premium Tiers**: Subscription-based features using Stripe.

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), Axios, Socket.io-client
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **File Uploads**: Multer (configured for a service like Cloudinary)

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- An email service provider (e.g., SendGrid) for email verification.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/lovegen.git](https://github.com/your-username/lovegen.git)
    cd lovegen
    ```
2.  **Install backend dependencies:**
    ```sh
    cd server
    npm install
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the `/server` directory and populate it based on the `.env.example` file.
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=a_very_strong_secret
    # ... other variables
    ```
4.  **Start the backend server:**
    ```sh
    npm run dev
    ```
5.  **Serve the frontend:**
    Open the `client/public/index.html` file with a live server extension in your code editor (e.g., VS Code Live Server).

## API Documentation
API endpoints are defined in the `/server/routes` directory. A Postman collection can be provided for easy testing.

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Log in an existing user.
- `GET /api/users/me` - Get the profile of the logged-in user (Protected).
- `GET /api/users/potential-matches` - Get profiles to swipe on (Protected).