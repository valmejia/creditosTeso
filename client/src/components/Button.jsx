import React from 'react';

import { Button, useTheme } from '@mui/material';


function ButtonR({ children, color, ...props }) {

  const theme = useTheme();

  // Determinar el color del botón

 const buttonColor = color && theme.palette[color] ? color : 'primary';
  return (

   <Button variant="contained" color={buttonColor} {...props}>

     {children}

   </Button>

  );

}



export default ButtonR;