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
import { getInitials } from '../../utils/get-initials';

export const PoolListResults = ({ matches, poolers, poolResults }) => {
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
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                    <Tooltip title="New England Patriots">
                      <Avatar
                        src={`/static/images/teams/NE.png`}
                        sx={{ mr: 1 }}
                      />
                    </Tooltip>
                      VS.
                    <Tooltip title="Miami Dolphins">
                      <Avatar
                        src={`/static/images/teams/MIA.png`}
                        sx={{ mr: 1 }}
                      />
                    </Tooltip>
                    </Box>
                  </TableCell>
                  {poolers.map((pooler) => (
                  <TableCell align="center">
                    0
                  </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

PoolListResults.propTypes = {
  matches: PropTypes.array.isRequired,
  poolResults: PropTypes.array.isRequired,
};
