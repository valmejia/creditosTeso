const express = require("express");
const router = express.Router();
const authService = require("../services/auth.services");

// POST /auth/signup  - Creates a new user in the database
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name, role, numeroDeTrabajador, matricula } = req.body;

    // Validation
    if (!email || !password || !name || role || numeroDeTrabajador || matricula) {
      return res.status(400).json({ message: "Provide email, password, name, role, numero de trabajador o matricula" });
    }

    // Perform signup via service
    const newUser = await authService.signupUser({ email, password, name,  role, numeroDeTrabajador, matricula});

    // Return the user object (excluding password)
    res.status(201).json({ user: { email: newUser.email, name: newUser.name, role: newUser.role, numeroDeTrabajador: newUser.numeroDeTrabajador, matricula: newUser.matricula} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ statusCode: 500, error: "Something went wrong" });
  }
});

// POST /auth/login - Verifies email and password and returns a JWT
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Provide email and password." });
    }

    // Perform login via service
    const authToken = await authService.loginUser({ email, password });

    res.status(200).json({ authToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: err.message });
  }
});

// GET /auth/verify - Used to verify JWT stored on the client
router.get("/verify", (req, res) => {
  try {
    // Verify JWT token using the service
    const verifiedPayload = authService.verifyToken(req.payload);

    res.status(200).json(verifiedPayload);
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
