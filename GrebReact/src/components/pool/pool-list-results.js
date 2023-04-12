import { useState, useEffect } from 'react';
import { useSession, getSession } from 'next-auth/react';
import {
    Badge,
    Box,
    Card,
    CardHeader,
    Container,
    FormControlLabel,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';

import { PoolMatchEntry } from './pool-match-entry';
import { WeekPicker } from '../week-picker'
import { TeamPick } from '../team-pick'

import { GetWeekLongName } from '../../utils/football'

export const PoolListResults = () => {
    const { data: session } = useSession();
    const [showseason, setShowseason] = useState(false);

    const [matches, setMatches] = useState([]);
    const [results, setResults] = useState([]);
    const [poolers, setPoolers] = useState({});
    const [weekdata, setWeekdata] = useState({});

    const [totals, setTotals] = useState([]);
    const [seasontotal, setSeasontotal] = useState({});

    useEffect(() => {
        let setup = true;

        getSession().then(session => {
                if (setup && session) {
                    fetch(`api/pools`, { headers: { 'pooler-email': session.user.email } })
                        .then( res => res.json() )
                        .then( data => {
                            if (setup) {
                                setMatches(data['matches']);
                                setResults(data['results']);
                                setPoolers(data['poolernames']);
                                setWeekdata(data['weekdata']);
                            }
                        });
                }
        });

        return () => setup = false;
    }, []);

    const handleWeekChange = (pickedseason, pickedweek) => {
        getSession().then(session => {
                fetch(`api/pools/${pickedseason}/${pickedweek}`, {
                    headers: { 'pooler-email': session.user.email }
                })
                    .then( res => res.json() )
                    .then( data => {
                        setMatches(data['matches']);
                        setResults(data['results']);
                        setPoolers(data['poolernames']);
                        setWeekdata(data['weekdata']);
                    });
        });
    }

    const handleToggleShowSeason = (event, newvalue) => {
        if (newvalue) {
            getSession().then(session => {
                fetch(`api/pools/${weekdata['season']}`, {
                    headers: { 'pooler-email': session.user.email }
                })
                    .then( res => res.json() )
                    .then( data => {
                        setTotals(data.totals)
                        setSeasontotal(data.fulltotals);
                    });
            });
        }

        setShowseason(newvalue);
    }

    const GetCardHeaderTitle = (weekdata) => {
        if (showseason) {
            if (weekdata['season'] && weekdata['week']) {
                return `Saison ${weekdata['season']}`;
            }
        } else {
            if (weekdata['season'] && weekdata['week']) {
                return `${weekdata['season']} - ${GetWeekLongName(weekdata['week'])}`;
            }
        }

        return '';
    }

    const GetResultsTable = () => {
        if (!showseason) {
            return (
                <Table size="small">
                <TableHead>
                    <TableRow key="Header">
                        <TableCell key="MatchLabel">
                        Match
                        </TableCell>

                        {results.map((res) => (
                            <TableCell key={res['pid']} align="center">
                                { poolers[res['pid']] }
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                {matches.map((match) => (
                    <TableRow key={match['idEvent']} hover>

                    <TableCell key="MatchEntry">
                        <PoolMatchEntry match={ match } />
                    </TableCell>

                    {results.map((res) => (
                        <TableCell key={res['pid']} align="center">
                            <Badge
                                showZero={true}
                                variant="dot"
                                badgeContent={res['scores'][match['idEvent']]['score']}
                                sx=
                                {{
                                    "& .MuiBadge-badge": {
                                        backgroundColor: GetScoreColor(res['scores'][match['idEvent']]['score'])
                                    }
                                }}
                            >

                                <TeamPick team = { res['scores'][match['idEvent']]['pick'] } />

                            </Badge>
                        </TableCell>
                    ))}

                    </TableRow>
                ))}

                <TableRow key="Totals" hover>

                    <TableCell key="TotalLabel">
                        Totals:
                    </TableCell>

                    {results.map((res) => (
                        <TableCell key={res['pid']} align="center">
                            { res['total'] }
                        </TableCell>
                    ))}

                </TableRow>
                </TableBody>
                </Table>
            );
        } else {
            return (
                <Table size="small">
                <TableHead>
                    <TableRow key="HeaderTotals">
                        <TableCell key="WeekLabel">
                        Semaine
                        </TableCell>

                        {results.map((res) => (
                            <TableCell key={`${res['pid']}-totals`} align="center">
                                { poolers[res['pid']] }
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                {totals.map((total, i) => (
                    <TableRow key={i} hover>

                    <TableCell key="WeekEntry">
                        { GetWeekLongName(i+1) }
                    </TableCell>

                    {results.map((res) => (
                        <TableCell key={`${res['pid']}-weektotals]`} align="center">
                            { total[res['pid']] }
                        </TableCell>
                    ))}

                    </TableRow>
                ))}

                <TableRow key="Totals" hover>

                    <TableCell key="TotalLabel">
                        Totals:
                    </TableCell>

                    {results.map((res) => (
                        <TableCell key={`${res['pid']}-fulltotal]`} align="center">
                            { seasontotal[res['pid']] }
                        </TableCell>
                    ))}

                </TableRow>
                </TableBody>
                </Table>
            );
        }
    }

    const GetScoreColor = (score) => {
        if (score === 0) return 'red';
        else if (score === 1) return 'gray';
        else if (score === 2) return 'green';
        else return 'blue';
    }

    return (
        <>
        { session &&
            <>
            <Container maxWidth="m">
                <WeekPicker season={ weekdata['season'] } maxweek={ 0 } weekSelected={ handleWeekChange } />
            </Container>

            <Container maxWidth="sm">
            <Box sx={{ mt: 3 }}>
                <FormControlLabel
                    control={<Switch />}
                    label="Total de la saison"
                    checked={showseason}
                    onChange={handleToggleShowSeason}
                />
            </Box>
            </Container>

            <Container maxWidth="sm">
            <Box sx={{ mt: 3 }}>
                <Card>
                    <CardHeader title={ GetCardHeaderTitle(weekdata) } />

                    { GetResultsTable() }
                </Card>
            </Box>
            </Container>
            </>
        }
        </>
    );
};
