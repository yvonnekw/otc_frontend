import React from 'react';
import { Container, Typography, Box } from '@mui/material';

interface HeaderMainProps {
  title: string;
}

const HeaderMain: React.FC<HeaderMainProps> = ({ title }) => {
  return (
    <header style={{ position: 'relative' }}>
      <Box
        className="overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: -1,
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h1" align="center" sx={{ color: 'white', mt: 8 }}>
          {title}
        </Typography>
      </Container>
    </header>
  );
};

export default HeaderMain;

/*
import React from 'react'

interface HeaderMainProps {
  title: string;
}

const HeaderMain: React.FC<HeaderMainProps> = ({ title }) => {
  return (
    <header>
      <div className='overlay'></div>
      <div className='container'>
        <h1 className='header-title text-center'>{title}</h1>
      </div>
    </header>
  );
}

export default HeaderMain;
*/
