import "./LoginPage.css";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/auth.context";
import authService from "../../services/auth.service";
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import EnhancedEncryptionIcon from '@mui/icons-material/EnhancedEncryption';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    // Send a request to the server using axios
    /* 
    axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`)
      .then((response) => {})
    */

    // Or using a service
    authService
      .login(requestBody)
      .then((response) => {
        // If the POST request is successful store the authentication token,
        // after the token is stored authenticate the user
        // and at last navigate to the home page
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/");
      })
      .catch((error) => {
        // If the request resolves with an error, set the error message in the state
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="LoginPage">

    <Container fixed maxWidth= "sm" sx={{ minHeight: '40vh' }} 
      style={{backgroundColor:"rgb(180, 233, 237)", marginTop:'5vh' }}>
      <Typography variant="h2" gutterBottom>Inicio de sesión</Typography> 
        
          <Form onSubmit={handleLoginSubmit}>
            <EmailIcon sx={{fontSize:70}} color='primary'></EmailIcon>
                <TextField label="Correo" color="secondary" focused margin='dense' 
                 type="email" name="email" value={email} onChange={handleEmail} />
            <div></div>
            <EnhancedEncryptionIcon sx={{fontSize:70}}color='primary'></EnhancedEncryptionIcon>
                  <TextField label="Contraseña" color="secondary" focused margin='dense'
                    type="password"
                    name="password"
                    value={password}
                    onChange={handlePassword}
                  />
            <div></div>
                

              
          </Form>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div></div>

      <Stack direction="row" spacing={2} style={{marginTop:'3vh'}}>
      <Button variant="contained" endIcon={<SendIcon/>} type="submit">
        Login
        </Button>
        <Button  sx={{ color: 'blue'}}>
        <Link to={""}> Olvidaste tu contraseña?</Link> 
        </Button>
      
      </Stack> 

      <p>Aun no tienes una cuenta?</p>
      <Link to={"/signup"}>Crear</Link>

    </Container>
    </div>
  );
}

export default LoginPage;
