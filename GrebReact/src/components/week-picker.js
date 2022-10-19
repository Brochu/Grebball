import { useState, useEffect } from 'react'
import {
    Box,
    Button,
    Card,
    CardHeader,
    Divider,
    ButtonGroup,
} from '@mui/material';

import { GetWeekShortName } from '../utils/football'

export const WeekPicker = ({ season, week, weekSelected }) => {
    const weeks = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ];

    return (
        <Card>
        <Box sx={{ display: 'flex', justifyContent: 'center', }}>
            <ButtonGroup size="small" variant="text" aria-label="text button group">

                {weeks.map((w) => (
                    <Button key={ w } onClick={ () => weekSelected(season, w) }>
                        { GetWeekShortName(w) }
                    </Button>
                ))}

            </ButtonGroup>
        </Box>
        </Card>
    );
};
