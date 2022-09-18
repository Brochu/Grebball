import { useState } from 'react'
import { Doughnut } from 'react-chartjs-2';
import { Box, Card, CardContent, CardHeader, Divider, Typography, useTheme } from '@mui/material';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import PhoneIcon from '@mui/icons-material/Phone';
import TabletIcon from '@mui/icons-material/Tablet';

export const MatchesPicker = ({ matches }) => {
  const theme = useTheme();
  const [picks, setPicks] = useState({});

  return (
    <Card>
      <CardHeader title="Create picks for Week 1" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 300,
            position: 'relative'
          }}
        >
          {matches.map((match) => (
            <p>{ match.strEventAlternate }</p>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
