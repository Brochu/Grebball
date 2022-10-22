import Head from 'next/head';
import { useSession } from 'next-auth/react'
import { Box, Container, Grid, Typography } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import { PoolerProfile } from '../components/pooler/pooler-profile';
import { PoolerProfileDetails } from '../components/pooler/pooler-profile-details';

const Page = () => {
    const { data: session } = useSession();

    if (session) {
        console.log(session.user);
    }

    return (
    <>
    <Head>
        <title>
            Pooler | Grebball
        </title>
    </Head>
    <Box
        component="main"
        sx={{
            flexGrow: 1,
                py: 8
        }}
    >
    <Container maxWidth="lg">
    <Typography sx={{ mb: 3 }} variant="h4">
        Pooler
    </Typography>

    <Grid container spacing={3}>

        <Grid item lg={4} md={6} xs={12}>
            <PoolerProfile />
        </Grid>

        <Grid item lg={8} md={6} xs={12}>
            <PoolerProfileDetails />
        </Grid>

    </Grid>
    </Container>
    </Box>
    </>
)};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;
