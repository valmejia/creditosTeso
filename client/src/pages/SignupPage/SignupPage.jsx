import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import e from "cors";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [matricula, setMatricula] = useState("");
  const [numeroDeTrabajador, setNumeroDeTrabajador] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleRole = (e) => setRole(e.target.value);
  const handleMatricula = (e) => setMatricula(e.target.value);
  const handleNumeroDeTrabajador = (e) => setNumeroDeTrabajador(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name, role, matricula, numeroDeTrabajador};
    
    
    // Send a request to the server using axios
    /* 
    const authToken = localStorage.getItem("authToken");
    axios.post(
      `${process.env.REACT_APP_SERVER_URL}/auth/signup`, 
      requestBody, 
      { headers: { Authorization: `Bearer ${authToken}` },
    })
    .then((response) => {})
    */

    // Or using a service
    authService
      .signup(requestBody)
      .then(() => {
        // If the POST request is successful redirect to the login page
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error:", error);  // Log the full error object
        // Check if the error response and message exist
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      });
  };

  return (
    <div className="SignupPage">
       <div>
        <h3>Request Body:</h3>
        <pre>{JSON.stringify({ email, password, name, role, matricula, numeroDeTrabajador }, null, 2)}</pre>
      </div>
      <h1>Sign Up</h1>

      <form onSubmit={handleSignupSubmit}>
        <label>Email:</label>
        <input type="email" name="email" value={email} onChange={handleEmail} />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        <label>Name:</label>
        <input type="text" name="name" value={name} onChange={handleName} />

        <label>Role:</label>
        <select type="text" name="role" value={role} onChange={handleRole}>
          <optgroup>
            <option value="Alumno"> Alumno </option>
            <option value="Profesor"> Profesor </option>
            <option value="Control Escolar"> Control Escolar </option>
            <option value="Jefatura"> Jefatura </option>
          </optgroup>
        </select>

        <label>Matricula:</label>
        <input type="text" name="matricula" value={matricula} onChange={handleMatricula} />

        <label>Numero de trabajador:</label>
        <input type="text" name="numeroDeTrabajador" value={numeroDeTrabajador} onChange={handleNumeroDeTrabajador} />

        <button type="submit">Sign Up</button>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <p>Already have account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  );
}

export default SignupPage;
