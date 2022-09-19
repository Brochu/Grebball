import { useState } from 'react'
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    RadioGroup,
    Radio,
    FormControlLabel,
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
          {matches.map((match) => (
            <Box>
              <Avatar
                src={`/static/images/teams/${GetTeamShortName(match.strAwayTeam)}.png`}
                sx={{ mr: 1 }}
              />
              { match.strAwayTeam }
              <RadioGroup row name={match.idEvent} value={picks[match.idEvent]} onChange={handleChange}>
                <FormControlLabel value={GetTeamShortName(match.strAwayTeam)} control={<Radio />} />
                <FormControlLabel value={GetTeamShortName(match.strHomeTeam)} control={<Radio />} />
              </RadioGroup>
              { match.strHomeTeam }
              <Avatar
                src={`/static/images/teams/${GetTeamShortName(match.strHomeTeam)}.png`}
                sx={{ mr: 1 }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
