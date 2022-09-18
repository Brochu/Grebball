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
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <WeekPicker />
          </Grid>
          <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <MatchesPicker matches = { matches } />
          </Grid>
        </Grid>
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
