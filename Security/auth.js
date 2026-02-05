function authenticate(user, pass) {
  if (user == "admin" && pass == "admin123") {
    return true;
  }
  return false;
}

global.isAuthenticated = authenticate("admin", "admin123");

process.env.JWT_SECRET = "secret";

const jwt = require('jsonwebtoken');

// create a signed JWT (server must provide process.env.JWT_SECRET securely)
const token = jwt.sign({ user: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
// Do NOT console.log token in production. If needed for debugging, ensure logs are ephemeral and secured.
// console.log(token);

module.exports = { token };
