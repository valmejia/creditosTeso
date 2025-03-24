const express = require("express");
const router = express.Router();
const authService = require("../services/auth.services");

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, role, numeroTrabajador, matricula } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ message: "Provide email" });
    } else if (!password) {
      return res.status(400).json({ message: "Provide password" });
    } else if (!name) {
      return res.status(400).json({ message: "Provide name" });
    } else if (!role) {
      return res.status(400).json({ message: "Provide role" });
    } else if ((role == "Profesor" || role == "Jefatura" || role == "Control Escolar") && !numeroTrabajador) {
      return res.status(400).json({ message: "Provide numero de trabajador" });
    } else if (role == "Alumno" && !matricula) {
      return res.status(400).json({ message: "Provide matricula" });
    }

    const emailRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (emailRegex.test(email)) {
     res.status(400).json({message:"Validation error: Invalid email format."});
   }

   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
   if (!passwordRegex.test(password)) {
     return res.status(400).json({
       message: "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one number"
     });
   }
    // Check if both matricula and numeroTrabajador are provided for conflicting roles
    if (matricula && numeroTrabajador) {
      if (role === 'Alumno') {
        res.status(400).json({ message:"Matricula and numero de trabajador cannot be provided together for 'Alumno' role."});
      } else if (role === 'Profesor' || role === 'Jefatura' || role === 'Control Escolar') {
        res.status(400).json({ message:"Numero de trabajador and matricula cannot be provided together for 'Profesor', 'Jefatura' or 'Control Escolar' roles."});
      }
    }

    // Perform signup via service
    const newUser = await authService.signupUser({ email, password, name, role, numeroTrabajador, matricula });

    // Return the user object (excluding password)
    res.status(201).json({
      user: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        numeroTrabajador: newUser.numeroTrabajador,
        matricula: newUser.matricula
      }
    });

  } catch (err) {
    console.error(err);
    // Send back the specific error message from the thrown error
    res.status(500).json({ statusCode: 500, error: err.message || "Something went wrong" });
  }
});


// POST /auth/login 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Provide email and password." });
    }

    const authToken = await authService.loginUser({ email, password });

    res.status(200).json({ authToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: err.message });
  }
});

// Middleware to verify token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  

  if (!token) {
    return res.status(403).json({ message: 'Token is required.' });
  }

  try {
    const verifiedPayload = authService.verifyToken(token);
    req.user = verifiedPayload;  
    next();  
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// GET /auth/verify 
router.get("/verify", verifyToken, (req, res) => {

  res.status(200).json({ message: "Token is valid", user: req.user });
});

module.exports = router;
