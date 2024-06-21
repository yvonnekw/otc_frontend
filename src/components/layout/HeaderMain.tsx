import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

const HeaderMain: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Container maxWidth="lg">
          <div className='overlay'></div>
          <div className='animated-text overlay-content'>
            <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
              Welcome to <span className='color'>Optical Telephone Company</span>
            </Typography>
            <Typography variant="h6">
              Make the cheapest calls to anyone, anytime around the world!
            </Typography>
          </div>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderMain;