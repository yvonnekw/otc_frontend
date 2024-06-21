import React from 'react';
import { Container, Typography } from '@mui/material';

const Footer: React.FC = () => {
  const today = new Date();

  return (
    <footer className="footer" style={{ backgroundColor: '#212121', color: '#fff', paddingTop: '20px', paddingBottom: '20px' }}>
      <Container>
        <Typography variant="body1" align="center" style={{ color: '#fff' }}>
          &copy; All rights reserved {today.getFullYear()} by Optical Telephone Company
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;


