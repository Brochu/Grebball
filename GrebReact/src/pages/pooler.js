import { useState, useEffect } from 'react'
import { useSession, getSession } from 'next-auth/react'

import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';

import { DashboardLayout } from '../components/dashboard-layout';
import { PoolerProfile } from '../components/pooler/pooler-profile';
import { PoolerProfileDetails } from '../components/pooler/pooler-profile-details';

const Page = () => {
    const { data: session } = useSession();
    const [pooler, setPooler] = useState({});

    useEffect(() => {
        let setup = true;

        getSession()
            .then(session => {
                if (setup && session) {
                    fetch(`/api/pooler`, {headers: { 'pooler-email': session.user.email }})
                        .then( res => res.json() )
                        .then( data => {
                            if (setup) {
                                setPooler(data);
                            }
                        });
                }
            });

        return () => setup = false;
    }, []);

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

    { session &&
        <Grid container spacing={3}>

            <Grid item lg={4} md={6} xs={12}>
                <PoolerProfile pooler={ pooler } />
            </Grid>

            <Grid item lg={8} md={6} xs={12}>
                <PoolerProfileDetails name={ pooler.name } favTeam={ pooler.favTeam } />
            </Grid>

        </Grid>
    }

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
