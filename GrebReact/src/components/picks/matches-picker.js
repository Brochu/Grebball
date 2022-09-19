import { useState } from 'react'
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    FormControlLabel,
    Radio,
    RadioGroup,
    Table,
    TableBody,
    TableCell,
    TableRow,
    useTheme,
} from '@mui/material';
import { GetTeamShortName } from '../../utils/football'

export const MatchesPicker = ({ matches }) => {
  const theme = useTheme();
  const [picks, setPicks] = useState({});

  const handleChange = (event) => {
      var t = event.target;
      picks[t.name] = t.value;
  };

  return (
    <Card>
      <CardHeader title="Create picks for Week 1" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            position: 'relative'
          }}
        >
          <Table size="small">
          <TableBody>
          {matches.map((match) => (
          <TableRow>
              <TableCell>
                  <Avatar
                    src={`/static/images/teams/${GetTeamShortName(match.strAwayTeam)}.png`}
                    sx={{ mr: 1 }}
                  />
              </TableCell>
              <TableCell>
                  { match.strAwayTeam }
              </TableCell>
              <TableCell>
                  <RadioGroup row name={match.idEvent} value={picks[match.idEvent]} onChange={handleChange}>
                    <FormControlLabel value={GetTeamShortName(match.strAwayTeam)} control={<Radio />} />
                    <FormControlLabel value={GetTeamShortName(match.strHomeTeam)} control={<Radio />} />
                  </RadioGroup>
              </TableCell>
              <TableCell>
                  { match.strHomeTeam }
              </TableCell>
              <TableCell>
                  <Avatar
                    src={`/static/images/teams/${GetTeamShortName(match.strHomeTeam)}.png`}
                    sx={{ mr: 1 }}
                  />
              </TableCell>
          </TableRow>
          ))}
          </TableBody>
          </Table>
        </Box>
      </CardContent>
    </Card>
  );
};
