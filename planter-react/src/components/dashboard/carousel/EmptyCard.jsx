import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const EmptyCard = ({ cardStyles }) => (
  <Card sx={{ ...cardStyles,
                 padding: 1, 
                backgroundColor: (theme) => theme.palette.background.paper,
                color: (theme) => theme.palette.text.primary,
           }}>
    <CardContent>
      <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
        No tasks to complete today
      </Typography>
    </CardContent>
  </Card>
);

export default EmptyCard;
