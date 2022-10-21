import { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField
} from '@mui/material';
import { Teams, GetTeamShortName } from '../../utils/football'
import { poolers } from '../../__mocks__/poolers'

export const PoolerProfileDetails = (props) => {
    const pooler = poolers[0];
    const [values, setValues] = useState({
        name: 'Alex',
        favTeam: 'GB',
    });

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    return (
        <form autoComplete="off" noValidate {...props}>
        <Card>
            <CardHeader subheader="The information can be edited" title="Pooler Profile" />

            <Divider />

            <CardContent>
            <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
                <TextField
                    fullWidth
                    helperText="Please specify pooler name"
                    label="Pooler Name"
                    name="name"
                    onChange={handleChange}
                    required
                    value={pooler.name}
                    variant="outlined"
                />
            </Grid>
            <Grid item md={6} xs={12}>
                <TextField
                    fullWidth
                    label="Select Favorite Team"
                    name="favTeam"
                    onChange={handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={pooler.favTeam}
                    variant="outlined"
                >
                    {Teams.map((team) => (
                        <option key={team} value={GetTeamShortName(team)}>
                            {team}
                        </option>
                    ))}
                </TextField>
            </Grid>

            </Grid>
            </CardContent>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
                <Button color="primary" variant="contained">
                    Save
                </Button>
            </Box>
        </Card>
        </form>
    );
};
