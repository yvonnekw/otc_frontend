import React from 'react';
import { Container, Typography } from '@mui/material';

const Parallax: React.FC = () => {
  return (
    <div className="parallax mb-5" style={{ backgroundImage: 'url(path_to_your_background_image)' }}>
      <Container className="text-center px-5 py-5" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <div className="animated-text bounceIn">
          <Typography variant="h1" component="h1" gutterBottom>
            Welcome to <span className="otc-color">Optical Telephone Company</span>
          </Typography>
          <Typography variant="h3" gutterBottom>
            Make the cheapest calls to friends and loved ones around the world
          </Typography>
        </div>
      </Container>
    </div>
  );
};

export default Parallax;
7
/*
import React from 'react'
import { Container } from 'react-bootstrap'

const Parallax: React.FC = () => {
  return (
    <div className='parallax mb-5'>
      <Container className='text-center px-5 py-5 justify-content-center'>
        <div className='animated-text bounceIn'>
          <h1>
            Welcome to <span className='otc-color'>Optical Telephone Company</span>
          </h1>
          <h3>Make the cheapest calls to friends and loved ones around the world</h3>
        </div>
      </Container>
    </div>
  );
}

export default Parallax;

*/

