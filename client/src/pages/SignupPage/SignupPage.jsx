import "./SignupPage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/auth.service";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import EmailIcon from '@mui/icons-material/Email';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';


function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [matricula, setMatricula] = useState("");
  const [numeroTrabajador, setNumeroTrabajador] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);
  const handleRole = (e) => setRole(e.target.value);
  const handleMatricula = (e) => setMatricula(e.target.value);
  const handleNumeroTrabajador = (e) => setNumeroTrabajador(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    // Create an object representing the request body
    const requestBody = { email, password, name, role, matricula, numeroTrabajador};
    
    
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
        <Container>
          <EmailIcon sx={{fontSize:70}} color='primary'></EmailIcon>
          <TextField label="Correo" color="secondary" focused margin='dense' type="email" name="email" value={email} onChange={handleEmail} />
        </Container>
        <Container>
          <DriveFileRenameOutlineIcon sx={{fontSize:70}}color='primary'></DriveFileRenameOutlineIcon>
          <TextField label="Nombre completo" color="secondary" focused margin='dense' type="text" name="name" value={name} onChange={handleName} />
        </Container>

        <EnhancedEncryptionIcon sx={{fontSize:70}}color='primary'></EnhancedEncryptionIcon>
        <TextField label="Contraseña" color="secondary" focused margin='dense'
          type="password"
          name="password"
          value={password}
          onChange={handlePassword}
        />
        <Container>
          <FormControl fullWidth color="secondary" focused margin='dense'>
            <InputLabel id="role-label">Rol</InputLabel>
              <Select 
                      labelId = "role-label"
                      id ="role"
                      label = "Rol"
                      type="text" name="role" 
                      value={role} onChange={handleRole}>
                
                  <MenuItem value = "Alumno">Alumno</MenuItem>
                  <MenuItem value = "Profesor">Profesor</MenuItem>
                  <MenuItem value = "Jefatura">Jefatura</MenuItem>
                  <MenuItem value = "Control Escolar">Control Escolar</MenuItem>
                </Select>                     
          </FormControl>
        </Container>
        <Container>
          <DriveFileRenameOutlineIcon sx={{fontSize:70}}color='primary'></DriveFileRenameOutlineIcon>
          <TextField label="Matricula" color="secondary" focused margin='dense' 
          type="text" name="matricula" value={matricula} onChange={handleMatricula} />
        </Container>
        <Container>
          <DriveFileRenameOutlineIcon sx={{fontSize:70}}color='primary'></DriveFileRenameOutlineIcon>
          <TextField label="Numero de trabajador" color="secondary" focused margin='dense' 
          type="text" name="numeroDeTrabajador" value={numeroTrabajador} onChange={handleNumeroTrabajador} />
        </Container>
        <Container>
          <Stack direction="row" spacing={2} style={{marginTop: '3vh', marginBottom: '3vh'}}>
            <Button variant="contained" type="submit">
              Crear
            </Button>
          </Stack>
        </Container>
        
      </form>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

        <Container style={{marginBottom: '1vh'}}></Container>
         <Link to={"/login"}> Ya tienes una cuenta?</Link>
    </Container>
    </div>
  );
}

export default SignupPage;
