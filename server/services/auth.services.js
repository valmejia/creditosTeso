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
  const payload = { 
    id: user.id, 
    email: user.email, 
    name: user.name,
    role: user.role 
  };
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "6h" }); 
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded; 
  } catch (error) {
    throw new Error("Invalid or expired token.");
  }
};


const checkRole = (role, requiredRole) => {
  if (role !== requiredRole) {
    throw new Error(`You don't have permission to access this resource. Required role: ${requiredRole}`);
  }
  return true;
};


// Sign up user (create new user)
const signupUser = async ({email, password, name, role, matricula, numeroTrabajador }) => {
  try {

     // Validate if the email format is correct
     const emailRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
     if (emailRegex.test(email)) {
      throw new Error("Validation error: Invalid email format.");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error( "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one number");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists.");
    }

    const validRoles = ["Alumno", "Jefatura", "Control Escolar", "Profesor"];
    if (!validRoles.includes(role)) {
      throw new Error("Invalid role. Valid roles are: Alumno, Jefatura, Control Escolar, Profesor.");
    }

    if (matricula && numeroTrabajador) {
      if (role === 'Alumno') {
        throw new Error("Matricula and numero de trabajador cannot be provided together for 'Alumno' role.");
      } else if (role === 'Profesor' || role === 'Jefatura' || role === 'Control Escolar') {
        throw new Error("Numero de trabajador and matricula cannot be provided together for 'Profesor', 'Jefatura' or 'Control Escolar' roles.");
      }
    }

    if (role === 'Alumno' && !matricula) {
      throw new Error('Matricula is required for \'Alumno\' role.');
    }

    if ((role === 'Profesor' || role === 'Jefatura' || role === 'Control Escolar') && !numeroTrabajador) {
      throw new Error("Numero de trabajador is required for 'Profesor' or 'Jefatura', 'Control Escolar' roles.");
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
      matricula: role === "Alumno" ? matricula : null,
      numeroTrabajador: role !== 'Alumno' ? numeroTrabajador : null,
    });

   

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      matricula: newUser.matricula || null,  
      numeroTrabajador: newUser.numeroTrabajador || null,  
    };

  } catch (error) {
    console.error("Error during user creation:", error);
    throw error;
  }
};


const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });

 if (!user) {
  throw new ValidationError("User with this email does not exist.");
}


  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    throw new Error("Incorrect password.");
  }

  const token = generateAuthToken(user);
  return token;
};


module.exports = {
  signupUser,
  loginUser,
  verifyToken,
  checkRole, 
  generateAuthToken,
  comparePassword
};
