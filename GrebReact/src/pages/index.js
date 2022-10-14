import Head from 'next/head';
import { Box, Container } from '@mui/material';

import { PoolListResults } from '../components/pool/pool-list-results';
import { WeekList } from '../components/pool/week-list';
import { DashboardLayout } from '../components/dashboard-layout';

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
        <WeekList />

        <Container maxWidth="sm">
            <Box sx={{ mt: 3 }}>
                <PoolListResults />
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
