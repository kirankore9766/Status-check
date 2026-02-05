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

function generateTokenForUser(user, requestedTtlSeconds = 3600) {
  // Require an authenticated user object to prevent arbitrary token minting
  if (!user || !user.id) throw new Error('generateTokenForUser requires a user with an id');
  if (user.isAuthenticated !== true) throw new Error('User must be authenticated to generate token');

  // Enforce a maximum TTL (e.g. 24 hours)
  const MAX_TTL = 24 * 60 * 60; // seconds
  const ttl = Math.min(Number(requestedTtlSeconds) || 3600, MAX_TTL);

  // Construct a minimal, validated payload — do not sign arbitrary caller input
  const payload = {
    sub: String(user.id),
    role: user.role || 'user'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ttl });
}

module.exports = { generateTokenForUser };
