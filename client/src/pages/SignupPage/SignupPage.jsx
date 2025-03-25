import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import { Container } from "@mui/material";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EmailIcon from '@mui/icons-material/Email';
import {Person} from '@mui/icons-material';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name };

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

      
      <Container fixed maxWidth= "sm" sx={{ minHeight: '45vh' }} style={{backgroundColor:"rgb(180, 233, 237)", marginTop:'5vh' }}>
      <Typography variant="h2" gutterBottom>Crear cuenta</Typography> 
     
      <form onSubmit={handleSignupSubmit}>
        <EmailIcon sx={{fontSize:70}} color='primary'></EmailIcon>
        <TextField label="Correo" color="secondary" focused margin='dense' type="email" name="email" value={email} onChange={handleEmail} />
        <div></div>
        <DriveFileRenameOutlineIcon sx={{fontSize:70}}color='primary'></DriveFileRenameOutlineIcon>
        <TextField label="Nombre" color="secondary" focused margin='dense' type="text" name="name" value={name} onChange={handleName} />
        <div></div>
        <DriveFileRenameOutlineIcon sx={{fontSize:70}}color='primary'></DriveFileRenameOutlineIcon>
        <TextField label="Apellido" color="secondary" focused margin='dense' type="text" name="name" value={name} onChange={handleName} />
        <div></div>
        <Person sx={{fontSize:70}}color='primary'></Person>
        <TextField label="Usuario" color="secondary" focused margin='dense' type="text" name="name" value={name} onChange={handleName} />
        <div></div>

        <EnhancedEncryptionIcon sx={{fontSize:70}}color='primary'></EnhancedEncryptionIcon>
        <TextField label="Contraseña" color="secondary" focused margin='dense'
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
        <div></div>
        <EnhancedEncryptionIcon sx={{fontSize:70}}color='primary'></EnhancedEncryptionIcon>
        <TextField label="Confirma contraseña" color="secondary" focused margin='dense'
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />

        <div>
        <Stack direction="row" spacing={2} style={{marginTop: '3vh', marginBottom: '3vh'}}>
        <Button variant="contained">
     Crear
     </Button>
     
   
 </Stack> 
        </div>
        
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div style={{marginBottom: '1vh'}}></div>
      <Link to={"/login"}> Ya tienes una cuenta?</Link>
      </Container>
    </div>
  );
}

export default SignupPage;
