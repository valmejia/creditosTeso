const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/index");  
const { User } = db;

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
const signupUser = async ({ email, password, name, role, matricula, numeroTrabajador }) => {

  try {
    
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists.");
    }

    const validRoles = ["Alumno", "Jefatura", "Control Escolar", "Profesor"];
    if (!validRoles.includes(role)) {
      throw new Error("Invalid role. Valid roles are: Alumno, Jefatura, Control Escolar, Profesor.");
    }

    if (role === "Alumno" && !matricula) {
      throw new Error("Matricula is required for 'Alumno' role.");
    }

    if ((role === "Profesor" || role === "Jefatura" || role === "Control Escolar") && !numeroTrabajador) {
      throw new Error("Numero de trabajador is required for 'Profesor' or 'Jefatura', 'Control Escolar' roles.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      matricula: role === "Alumno" ? matricula : null, 
      numeroTrabajador: (role === "Profesor" || role === "Jefatura" || role === "Control Escolar") ? numeroTrabajador : null, 
    });

    return { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role };
    
  } catch (error) {
    console.error(error); 
    throw error
  }
};



const loginUser = async ({ email, password }) => {

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error("User not found.");
    }

    const passwordCorrect = await comparePassword(password, user.password);
    if (!passwordCorrect) {
      throw new Error("Incorrect password.");
    }

  // Generate JWT including role
  const token = generateAuthToken(user);
    return token;

};

// Verify JWT and return payload (including the role)
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded; // Returns decoded JWT payload (including the role)
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};

// You can also check if the role is valid by creating a helper function to validate the role:
const checkRole = (role, requiredRole) => {
  if (role !== requiredRole) {
    throw new Error(`You don't have permission to access this resource. Required role: ${requiredRole}`);
  }
  return true;
};


module.exports = {
  signupUser,
  loginUser,
  verifyToken,
  checkRole, 
  generateAuthToken,
  comparePassword
};
