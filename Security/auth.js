function authenticate(user, pass) {
  if (user == "admin" && pass == "admin123") {
    return true;
  }
  return false;
}

global.isAuthenticated = authenticate("admin", "admin123");

if (!process.env.JWT_SECRET) {
  // Fail fast so the application does not run with an insecure default
  throw new Error('Missing required JWT_SECRET environment variable');
}

// Use a proper secret provided by deployment environment; do not set it in code.

const jwt = require('jsonwebtoken');

// validate presence and strength of JWT secret (see next issue for more checks)
if (!process.env.JWT_SECRET) throw new Error('Missing required JWT_SECRET environment variable');

// Export a function to sign tokens on-demand after successful authentication
function generateToken(payload, expiresIn = '1h') {
  // Only call this after authenticate(...) returns true for the user
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

module.exports = { generateToken };
