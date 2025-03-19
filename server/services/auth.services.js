const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");  
const { User } = db;
 // Accede al modelo User
// Helper to hash passwords
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Helper to compare passwords
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Helper to create a JWT token
const generateAuthToken = (user) => {
  const payload = { id: user.id, email: user.email, name: user.name };
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "6h" });
};

// Sign up user (create new user)
const signupUser = async ({ email, password, name }) => {
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, name });

    return { id: newUser.id, email: newUser.email, name: newUser.name };
  } catch (error) {
    console.error(error);  // Log the error to investigate
    throw new Error("Internal Server Error");
  }
};


// Log in user and generate JWT
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found.");
  }

  const passwordCorrect = await comparePassword(password, user.password);
  if (!passwordCorrect) {
    throw new Error("Incorrect password.");
  }

  // Generate JWT
  return generateAuthToken(user);
};

// Verify JWT and return payload
const verifyToken = (payload) => {
  return payload; // Simply returns the decoded JWT payload
};

module.exports = {
  signupUser,
  loginUser,
  verifyToken,
};
