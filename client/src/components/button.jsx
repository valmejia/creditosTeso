import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';


function button(props){


    return(
        <Container maxWidth="sm">
            <Button variant="contained">{props.name}</Button>
        </Container>
    )  

}

export default button;