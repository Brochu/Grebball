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
    useTheme,
} from '@mui/material';
import { TeamLogo } from '../team-logo'
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
        <Box sx={{ position: 'relative' }}>
          {matches.map((match) => (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <TeamLogo team = { match.strAwayTeam }></TeamLogo>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <RadioGroup row name={match.idEvent} value={picks[match.idEvent]} onChange={handleChange}>
                    <FormControlLabel
                      value={GetTeamShortName(match.strAwayTeam)}
                      control={<Radio />}
                    />
                    <FormControlLabel
                      value={GetTeamShortName(match.strHomeTeam)}
                      control={<Radio />}
                    />
                  </RadioGroup>

                  <TeamLogo team = { match.strHomeTeam }></TeamLogo>
              </Box>

          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
