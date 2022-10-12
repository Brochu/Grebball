import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { WeekPicker } from '../components/picks/week-picker';
import { DashboardLayout } from '../components/dashboard-layout';

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
            <WeekPicker />
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
