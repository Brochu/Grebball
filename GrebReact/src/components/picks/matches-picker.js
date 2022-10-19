import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import { TeamLogo } from '../team-logo'
import { WeekPicker } from '../week-picker'
import { GetTeamShortName, GetWeekLongName } from '../../utils/football'

export const MatchesPicker = () => {
    const router = useRouter();

    const [season, setSeason] = useState(9999);
    const [week, setWeek] = useState(99);
    const [weekdata, setWeekdata] = useState([]);
    const [picks, setPicks] = useState({});

    useEffect(() => {
        let setup = true;

        fetch(`http://localhost:5000/picks`)
            .then( res => res.json() )
            .then( data => {
                if (setup) {
                    setSeason(data.weekinfo.season);
                    setWeek(data.weekinfo.week);
                    setWeekdata(data.weekdata);
                }
            });

        return () => setup = false;
    }, []);

    const handleWeekChange = (pickedseason, pickedweek) => {
        console.log(`${pickedseason} : ${pickedweek}`);

        //fetch(`http://localhost:5000/picks/new/${season}/${pickedweek}`)
        //    .then( res => res.json() )
        //    .then( data => {
        //        if (setup) {
        //            setWeekdata(data);
        //        }
        //    });
    }

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
        payload['season'] = season;
        payload['week'] = week;
        //TODO: Find a way to store the current logged in user id to use here
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
        <>
        <Container maxWidth="m">
            <WeekPicker season={season} week={week} weekSelected={handleWeekChange}/>
        </Container>

        <Container maxWidth="xs">
        <Card>
            <CardHeader title={ `Nouveaux choix pour : ${ GetWeekLongName(week) }` } />

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
        </Container>
        </>
    );
};
