import React from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

import { UsersCardArea, AssignmentCard } from '../../Components/HomeCards/HomeCards';

export const InicioView = () => {
    return (
        <Container sx={{ py: 10 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={5} justifyContent="space-around">
                <UsersCardArea/>
                <AssignmentCard/>
            </Stack>
        </Container>
    )
}