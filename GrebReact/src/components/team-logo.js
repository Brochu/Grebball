import {
  Avatar,
  Box,
  Tooltip,
} from '@mui/material';
import { GetTeamShortName } from '../utils/football'

export const TeamLogo = ({ team }) => {
  return (
    <Tooltip title={team}>
      <Avatar
        src={`/static/images/teams/${GetTeamShortName(team)}.png`}
        sx={{ mr: 1 }}
      />
    </Tooltip>
  );
};
