import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
    Box,
    Button,
    Card,
    CardHeader,
    Divider,
    ButtonGroup,
    useTheme
} from '@mui/material';

import { GetWeekShortName } from '../../utils/football'

export const WeekList = (props) => {
    // Is this what we should use to color based on fav team?
    const theme = useTheme();
    const router = useRouter();
    const weeks = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ];

    const [season, setSeason] = useState(9999);

    useEffect(() => {
        let setup = true;

        fetch(`http://localhost:5000/picks`)
            .then( res => res.json() )
            .then( data => {
                if (setup) {
                    setSeason(data.season);
                }
            });

        return () => setup = false;
    }, []);

    const handleWeekSelect = (weeknum) => {
        if (season != 9999) {
            router.replace(`/pools/${season}/${weeknum}`)
                .then(() => router.reload());
        }
    };

    return (
        <Card {...props}>

            <Box sx={{ display: 'flex', justifyContent: 'center', }}>
                <ButtonGroup size="small" variant="text" aria-label="text button group">
                    {weeks.map((w) => (
                        <Button
                            key={w}
                            onClick={() => handleWeekSelect(w)}
                        >
                            { GetWeekShortName(w) }
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>

        </Card>
    );
};
