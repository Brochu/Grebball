import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession, getSession } from 'next-auth/react'
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

import { BACK_URI } from '../../lib/backend';

import { TeamLogo } from '../team-logo'
import { WeekPicker } from '../week-picker'
import { GetTeamShortName, GetWeekLongName } from '../../utils/football'

export const MatchesPicker = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const [season, setSeason] = useState(9999);
    const [week, setWeek] = useState(99);
    const [maxweek, setMaxweek] = useState(99);
    const [weekdata, setWeekdata] = useState([]);
    const [picks, setPicks] = useState({});

    useEffect(() => {
        let setup = true;

        getSession().then( session => {
            if (setup && session) {
                fetch(`/api/picks`, {
                    headers: { 'pooler-email': session.user.email },
                })
                    .then( res => res.json() )
                    .then( data => {
                        if (setup) {
                            setSeason(data.weekinfo.season);
                            setWeek(data.weekinfo.week);
                            setMaxweek(data.weekinfo.week);
                            setWeekdata(data.weekdata);

                            setPicks({});
                        }
                    });
            }
        });

        return () => setup = false;
    }, []);

    const handleWeekChange = (pickedseason, pickedweek) => {
        fetch(`api/picks/new/${pickedseason}/${pickedweek}`)
            .then( res => res.json() )
            .then( data => {
                setSeason(data.weekinfo.season);
                setWeek(data.weekinfo.week);
                setWeekdata(data.weekdata);
                setPicks({});
            });
    }

    const handleChange = (event) => {
        var t = event.target;
        picks[t.name] = t.value;
    };

    const handleSubmitPicks = (event) => {
        let payload = JSON.parse(JSON.stringify(picks));

        //TODO: Find a better way to handle this?
        let matchIds = [];
        for (const i in weekdata) {
            matchIds.push(weekdata[i]['idEvent']);
        }

        payload['matchids'] = JSON.stringify(matchIds);
        payload['season'] = season;
        payload['week'] = week;
        payload['pooler-email'] = session.user.email;

        fetch(`api/picks/create`, {
            method: 'post',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then( res => res.json() )
            .then( data => {
                if (data.success) {
                    router.push('/');
                }
            });

        // Prevent double submit
        event.target.disabled = true;
    }

    return (
        <>
        { session &&
        <>
        <Container maxWidth="m">
            <WeekPicker season={season} maxweek={maxweek} weekSelected={handleWeekChange}/>
        </Container>

        <Container maxWidth="xs">
        <Box sx={{ mt: 3 }}>
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
        </Box>
        </Container>
        </>
        }
        </>
    );
};
