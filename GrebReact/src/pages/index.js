import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { PoolListResults } from '../components/pool/pool-list-results';
import { DashboardLayout } from '../components/dashboard-layout';
import { customers } from '../__mocks__/customers';
import { matches } from '../__mocks__/matches';
import { poolers } from '../__mocks__/poolers';

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
        <Box sx={{ mt: 3 }}>
          <PoolListResults matches = { matches } poolers = { poolers } poolResults={ customers } />
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
