import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import {
  FOCard,
  CobreCard,
  CambaceoCard,
} from "../../Components/AssignmentCards/AssignmentCards";


export const AssignmentView = () => {
  return (
    <Container sx={{ py: 10 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        justifyContent="center"
      >
     
        <FOCard />
        <CobreCard />
        <CambaceoCard />
      </Stack>
    </Container>
  );
};
