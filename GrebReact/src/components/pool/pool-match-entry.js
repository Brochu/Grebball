import { useState } from 'react';
import {
  Avatar,
  Box,
  Tooltip,
} from '@mui/material';
import { TeamLogo } from '../team-logo'

export const PoolMatchEntry = ({ match }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        fontFamily: 'monospace',
      }}
    >
    <TeamLogo team = { match.strAwayTeam } />
      { match.intAwayScore }
      | VS. |
      { match.intHomeScore }
    <TeamLogo team = { match.strHomeTeam } />
    </Box>
  );
};
