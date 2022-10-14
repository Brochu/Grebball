import { useState } from 'react';
import {
    Avatar,
    Box,
    Tooltip,
} from '@mui/material';
import { TeamLogo } from '../team-logo'

export const PoolMatchEntry = ({ match }) => {
    const PaddedScore = (score) => {
        if (score) {
            return score.padStart(2, 0);
        } else {
            return '--';
        }
    }

    return (
        <Box
            sx={{
                alignItems: 'center',
                    display: 'flex',
                    fontFamily: 'monospace',
            }}
        >
            <TeamLogo team = { match.strAwayTeam } />
            &nbsp;
            { PaddedScore(match.intAwayScore) }
            | VS. |
            { PaddedScore(match.intHomeScore) }
            &nbsp;
            <TeamLogo team = { match.strHomeTeam } />
        </Box>
    );
};
