import { Box, Button, Card, CardHeader, Divider, ButtonGroup, useTheme } from '@mui/material';
import { GetWeekShortName } from '../../utils/football'

export const WeekPicker = (props) => {
  // Is this what we should use to color based on fav team?
  const theme = useTheme();

  const weeks = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22 ];

  return (
    <Card {...props}>
      <CardHeader title="Pick a week" />
      <Divider />
      <Box sx={{
          display: 'flex',
          justifyContent: 'center',
      }}>
      <ButtonGroup size="small" variant="text" aria-label="text button group">
        {weeks.map((w) => (
          <Button>{ GetWeekShortName(w) }</Button>
        ))}
      </ButtonGroup>
      </Box>
      <Divider />
    </Card>
  );
};
