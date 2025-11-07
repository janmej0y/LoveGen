import React from "react";

const Register = () => (
  <div className="auth-container">
    <h2>Create Account</h2>
    <form>
      <input type="text" placeholder="Username" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  </div>
);

export default Register;
