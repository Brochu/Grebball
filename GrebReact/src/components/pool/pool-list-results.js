import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Avatar,
    Box,
    Card,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Tooltip,
} from '@mui/material';

import { PoolMatchEntry } from './pool-match-entry';
import { TeamLogo } from '../team-logo'
import { TeamPick } from '../team-pick'

export const PoolListResults = ({ season = 9999, week = 99 }) => {
    const [matches, setMatches] = useState([]);
    const [results, setResults] = useState([]);
    const [poolers, setPoolers] = useState({});

    useEffect(() => {
        let setup = true;

        if (season === 9999) {
            fetch(`http://localhost:5000/pools`)
                .then( res => res.json() )
                .then( data => {
                    if (setup) {
                        setMatches(data['matches']);
                        setResults(data['results']);
                        setPoolers(data['poolernames']);
                    }
                });
        } else {
            fetch(`http://localhost:5000/pools/${season}/${week}`)
                .then( res => res.json() )
                .then( data => {
                    if (setup) {
                        setMatches(data['matches']);
                        setResults(data['results']);
                        setPoolers(data['poolernames']);
                    }
                });
        }

        return () => setup = false;
    }, []);

    return (
        <Card>
        <PerfectScrollbar>
        <Box>
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
                            <TeamPick team = { res['scores'][match['idEvent']]['pick'] } />
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
        </Box>
        </PerfectScrollbar>
        </Card>
    );
};
