import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { PoolListResults } from '../components/pool/pool-list-results';
import { DashboardLayout } from '../components/dashboard-layout';
import { matches } from '../__mocks__/matches';
import { poolers } from '../__mocks__/poolers';
import { scores } from '../__mocks__/scores';
import { totals } from '../__mocks__/totals';

const Page = () => (
  <>
    <Head>
      <title>
        Pool | Grebball
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
        <Box sx={{ mt: 3 }}>
          <PoolListResults matches = { matches } poolers = { poolers } scores={ scores } totals={ totals } />
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
