import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';



function requisitospage() { 
  return (
    <div>
      <Container maxWidth = "lg" sx={{ bgcolor: '#cfe8fc', height: '75vh' }}>
        
        <Typography variant="h" gutterBottom>
           <h1 align = "center">Inscripción a las Actividades Culturales y Deportivas.</h1>  
        </Typography>
      <Container fixed sx={{ bgcolor: '#fff2af', height: '50vh' }}>

        <Typography variant="body1" gutterBottom > 
          <div  align="center">1.- Llenar este formulario.</div>  
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center"> 2.- Imprimir y llenar el formato de inscripción y evaluación de actividades culturales y 
          deportivas del TESOEM (FO-CD-01), debidamente requisitado a computadora con letras de color azul.</div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">Ojo: la firma debe de ser rellenada a mano con tinta azul. 
           (link para descargar el formato: <a href ="https://acortar.link/2yPt0s">https://acortar.link/2yPt0s</a>). 
          
          </div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">Si tiene alguna duda sobre como llenar el formato ingresa al siguiente 
          link:<a href = "https://acortar.link/bJ62XJ">https://acortar.link/bJ62XJ</a> 
          </div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">Horario de las actividades culturales y deportivas:
          <a href = "https://acortar.link/aHkAZL">https://acortar.link/aHkAZL</a> 
          </div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">3.- Entregar al Departamento de Vinculación, los siguientes documentos:</div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">- Formato FO-CD-01.</div>
        </Typography>
            
        <Typography variant="body3" gutterBottom>
          <div  align="center">- Tira de materias y/o credencial de la escuela.</div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">- Captura de pantalla de este formulario de inscripción concluido.</div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">- Captura de pantalla del formulario médico concluido. NOTA: DEBERÁS DE PASAR AL ÁREA MÉDICA
          TURNO MATUTINO, PARA QUE TE FIRMEN Y SELLEN EN LA CAPTURA DE PANTALLA DEL </div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">FORMULARIO MÉDICO (ingresa en el siguiente link en tu navegador para acceder a el: 
            <a href = "https://acortar.link/uEeJWL">https://acortar.link/uEeJWL</a>)
          
          </div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">-Al concluir, el profesor asignado dará seguimiento a tu proceso.</div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">NOTA: El proceso de inscripción a las actividades culturales y deportivas mediante el rubro de 
          "crédito complementario" inicia el martes 03 de marzo y se cierra el 29 de marzo; excepto para la </div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">modalidad "hobby".</div>
        </Typography>

        <Typography variant="body3" gutterBottom>
          <div  align="center">Si estas interesado da clic en el botón "SIGUIENTE".</div>
        </Typography>

      </Container>
          
     </Container>
    </div>
  );
}

export default requisitospage;