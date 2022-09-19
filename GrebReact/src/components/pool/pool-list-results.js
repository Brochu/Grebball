import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
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

export const PoolListResults = ({ matches, poolers, scores, totals }) => {
  return (
    <Card>
      <PerfectScrollbar>
        <Box>
          <Table size="small">
            <TableHead>
              <TableRow>

                <TableCell>
                  Match
                </TableCell>

                {poolers.map((pooler) => (
                <TableCell>
                  { pooler.name }
                </TableCell>
                ))}

              </TableRow>
            </TableHead>
            <TableBody>
              {matches.map((match) => (
                <TableRow hover>

                  <TableCell>
                    <PoolMatchEntry match={ match } />
                  </TableCell>

                  {poolers.map((pooler) => (
                  <TableCell align="center">
                    { scores[pooler._id][match.idEvent] }
                  </TableCell>
                  ))}

                </TableRow>
              ))}

              <TableRow hover>
                <TableCell>
                  Totals:
                </TableCell>

                {poolers.map((pooler) => (
                <TableCell align="center">
                  { totals[pooler._id] }
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

PoolListResults.propTypes = {
  matches: PropTypes.array.isRequired,
  poolers: PropTypes.array.isRequired,
  scores: PropTypes.array.isRequired,
};
