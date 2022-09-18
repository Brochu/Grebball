import { useState } from 'react'
import { Box, Card, CardContent, CardHeader, Divider, Radio, useTheme } from '@mui/material';
import { GetTeamShortName } from '../../utils/football'

export const MatchesPicker = ({ matches }) => {
  const theme = useTheme();
  const [picks, setPicks] = useState({});

  const handleChange = (event) => {
      var t = event.target;
      console.log(`${t.name} -> ${t.value}`);
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
              { match.strAwayTeam }
              <Radio name={match.idEvent} value={GetTeamShortName(match.strAwayTeam)} onChange={handleChange} />

              <Radio name={match.idEvent} value={GetTeamShortName(match.strHomeTeam)} onChange={handleChange} />
              { match.strHomeTeam }
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
