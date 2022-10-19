import { useState, useEffect } from 'react';
import {
    Avatar,
    Badge,
    Box,
    Card,
    CardHeader,
    Container,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
} from '@mui/material';

import { PoolMatchEntry } from './pool-match-entry';
import { WeekPicker } from '../week-picker'
import { TeamLogo } from '../team-logo'
import { TeamPick } from '../team-pick'

import { GetWeekLongName } from '../../utils/football'

export const PoolListResults = () => {
    const [matches, setMatches] = useState([]);
    const [results, setResults] = useState([]);
    const [poolers, setPoolers] = useState({});
    const [weekdata, setWeekdata] = useState({});

    useEffect(() => {
        let setup = true;

        fetch(`http://localhost:5000/pools`)
            .then( res => res.json() )
            .then( data => {
                if (setup) {
                    setMatches(data['matches']);
                    setResults(data['results']);
                    setPoolers(data['poolernames']);
                    setWeekdata(data['weekdata']);
                }
            });

        return () => setup = false;
    }, []);

    const handleWeekChange = (pickedseason, pickedweek) => {
        fetch(`http://localhost:5000/pools/${pickedseason}/${pickedweek}`)
            .then( res => res.json() )
            .then( data => {
                setMatches(data['matches']);
                setResults(data['results']);
                setPoolers(data['poolernames']);
                setWeekdata(data['weekdata']);
            });
    }

    const GetCardHeaderTitle = (weekdata) => {
        if (weekdata['season'] && weekdata['week']) {
            return `${weekdata['season']} - ${GetWeekLongName(weekdata['week'])}`
        }

        return '';
    }

    const GetScoreColor = (score) => {
        if (score === 0) return 'red';
        else if (score === 1) return 'gray';
        else if (score === 2) return 'green';
        else return 'blue';
    }

    return (
        <>
        <Container maxWidth="m">
            <WeekPicker season={ weekdata['season'] } maxweek={ 0 } weekSelected={ handleWeekChange } />
        </Container>

        <Container maxWidth="sm">
        <Box sx={{ mt: 3 }}>
            <Card>
                <CardHeader title={ GetCardHeaderTitle(weekdata) } />

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
            </Card>
        </Box>
        </Container>
        </>
    );
};
