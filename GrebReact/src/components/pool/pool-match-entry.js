import { useState } from 'react';
import {
  Avatar,
  Box,
  Tooltip,
} from '@mui/material';
import { GetTeamShortName } from '../../utils/football'

export const PoolMatchEntry = ({ match }) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        fontFamily: 'monospace',
      }}
    >
    <Tooltip title={match.strAwayTeam}>
      <Avatar
        src={`/static/images/teams/${GetTeamShortName(match.strAwayTeam)}.png`}
        sx={{ mr: 1 }}
      />
    </Tooltip>
      { match.intAwayScore }
      | VS. |
      { match.intHomeScore }
    <Tooltip title={match.strHomeTeam}>
      <Avatar
        src={`/static/images/teams/${GetTeamShortName(match.strHomeTeam)}.png`}
        sx={{ mr: 1 }}
      />
    </Tooltip>
    </Box>
  );
};
