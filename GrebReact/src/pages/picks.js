import Head from 'next/head';
import { Box } from '@mui/material';
import { MatchesPicker } from '../components/picks/matches-picker';
import { DashboardLayout } from '../components/dashboard-layout';

const Page = () => (
    <>
        <Head>
            <title>
                Picks | Grebball
            </title>
        </Head>
        <Box component="main" sx={{ flexGrow: 1, py: 8 }}>
            <MatchesPicker />
        </Box>
    </>
);

Page.getLayout = (page) => (
    <DashboardLayout>
    {page}
    </DashboardLayout>
);

export default Page;
