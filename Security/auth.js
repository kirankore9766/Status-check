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

// create a signed JWT (server must provide process.env.JWT_SECRET securely)
const token = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
// Do NOT console.log token in production. If needed for debugging, ensure logs are ephemeral and secured.
// console.log(token);

module.exports = { token };
