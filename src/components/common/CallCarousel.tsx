import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

function CallCarousel(): JSX.Element {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h4" align="center">
          CallCarousel Page
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This is the CallCarousel page content. You can replace this with your carousel component.
        </Typography>
      </Paper>
    </Container>
  );
}

export default CallCarousel;

