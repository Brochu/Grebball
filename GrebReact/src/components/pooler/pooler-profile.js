import {
    Avatar,
    Box,
    Card,
    CardContent,
    Typography
} from '@mui/material';
import { poolers } from '../../__mocks__/poolers'

export const PoolerProfile = (props) => {
    const pooler = poolers[0];

    return (
        <Card {...props}>
            <CardContent>
                <Box
                    sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>

                    <Avatar
                        src={`/static/images/teams/${pooler.favTeam}.png`}
                        sx={{ height: 96, mb: 2, width: 96 }} />


                    <Typography color="textPrimary" gutterBottom variant="h3">
                        {pooler.name}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
)};
