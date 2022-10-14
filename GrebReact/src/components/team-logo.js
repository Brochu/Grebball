import {
    Avatar,
    Box,
    Tooltip,
} from '@mui/material';
import { GetTeamShortName } from '../utils/football'

export const TeamLogo = ({ team }) => {
    return (
        <Tooltip title={team}>
            <Box
                component="img"
                sx={{ height: 40, width: 40 }}
                src={`/static/images/teams/${GetTeamShortName(team)}.png`}
            />
        </Tooltip>
    );
};
