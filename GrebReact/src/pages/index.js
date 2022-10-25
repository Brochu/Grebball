import Head from 'next/head';
import { Box } from '@mui/material';

import { PoolListResults } from '../components/pool/pool-list-results';
import { DashboardLayout } from '../components/dashboard-layout';

const Page = () => (
    <>
        <Head>
            <title>
                Pool | Grebball
            </title>
        </Head>

        <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
            <PoolListResults />
        </Box>
    </>
);

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
