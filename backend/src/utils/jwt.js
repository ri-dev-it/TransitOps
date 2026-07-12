const jwt = require('jsonwebtoken');

// Uses the secret from your .env file, or a secure fallback for development
const SECRET = process.env.JWT_SECRET || 'transitops_super_secret_key';

function signToken(payload) {
  // Generates a token valid for 8 hours
  return jwt.sign(payload, SECRET, { expiresIn: '8h' });
}

function verifyToken(token) {
  // Verifies and decodes the token
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };