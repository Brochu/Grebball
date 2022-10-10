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
                sx={{ height: 50, width: 50 }}
                alt="The house from the offer."
                src={`/static/images/teams/${GetTeamShortName(team)}.png`}
            />
        </Tooltip>
    );
};
