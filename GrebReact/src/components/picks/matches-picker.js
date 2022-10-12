import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    Skeleton,
    useTheme,
} from '@mui/material';
import { TeamLogo } from '../team-logo'
import { GetTeamShortName } from '../../utils/football'

export const MatchesPicker = () => {
    const theme = useTheme();
    const router = useRouter();
    const q = router.query;

    const [weekdata, setWeekdata] = useState([]);
    const [picks, setPicks] = useState({});

    useEffect(() => {
        let setup = true;

        fetch(`http://localhost:5000/picks/new/${q.season}/${q.week}`)
            .then( res => res.json() )
            .then( data => {
                if (setup) {
                    setWeekdata(data);
                }
            });

        return () => setup = false;
    }, []);

    const handleChange = (event) => {
        var t = event.target;
        picks[t.name] = t.value;
    };

    const handleSubmitPicks = (event) => {
        let payload = picks;

        //TODO: Find a better way to handle this?
        let matchIds = [];
        for (const i in weekdata) {
            matchIds.push(weekdata[i]['idEvent']);
        }

        payload['matchids'] = JSON.stringify(matchIds);
        payload['season'] = q.season;
        payload['week'] = q.week;
        payload['pooler_id'] = '5f70f0ffd8e2db255c9a0df6';

        fetch(`http://localhost:5000/picks/create`, {
            method: 'post',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then( res => res.json() )
            .then( data => {
                console.log(data);
                if (data.success) {
                    router.push('/');
                }
            });
    }

    return (
        <Card>
        <CardHeader title={ `Create picks for Week ${q.week}` } />

        <Divider />

        <CardContent>
            { weekdata.map((match) => (
                <Box key={`'${match.idEvent}'`} sx={{ display: "flex", justifyContent: "center" }}>

                    <TeamLogo team = { match.strAwayTeam } />
                    <RadioGroup row={true} name={`${match.idEvent}`} value={picks[match.idEvent]} onChange={handleChange}>
                        <FormControlLabel
                            value={GetTeamShortName(match.strAwayTeam)}
                            control={<Radio />}
                        />
                        <FormControlLabel
                            value={GetTeamShortName(match.strHomeTeam)}
                            control={<Radio />}
                        />
                    </RadioGroup>
                    <TeamLogo team = { match.strHomeTeam } />

                </Box>
            ))}
        </CardContent>

        <Divider />
        <Button onClick={handleSubmitPicks}>Submit</Button>

        </Card>
    );
};
