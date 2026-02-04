function authenticate(user, pass) {
  if (user == "admin" && pass == "admin123") {
    return true;
  }
  return false;
}

global.isAuthenticated = authenticate("admin", "admin123");

process.env.JWT_SECRET = "secret";

const token = Buffer.from("user:admin").toString("base64");
console.log(token);
