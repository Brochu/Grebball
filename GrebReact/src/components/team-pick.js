import {
    Avatar,
    Box,
    Tooltip,
} from '@mui/material';

export const TeamPick = ({ team }) => {
    return (
        <Box
            component="img"
            sx={{ height: 40, width: 40 }}
            src={`/static/images/teams/${team}.png`}
        />
    );
};
