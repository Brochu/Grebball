import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { WeekPicker } from '../components/picks/week-picker';
import { MatchesPicker } from '../components/picks/matches-picker';
import { DashboardLayout } from '../components/dashboard-layout';
import { matches } from '../__mocks__/matches'

const Page = () => (
  <>
    <Head>
      <title>
        Picks | Grebball
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ mt: 3 }}>
          <WeekPicker />
        </Box>
      </Container>

      <Container maxWidth="md">
        <Box sx={{ mt: 3 }}>
          <MatchesPicker matches = { matches } />
        </Box>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
