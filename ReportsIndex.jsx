import React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import {
  RepTecCard,
  RepFotoCard,
} from "../../Components/ReportsCards/ReportsCards";

export const ReportsView = () => {
  return (
    <Container sx={{ py: 10 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={3}
        justifyContent="center"
      >
        <RepTecCard />
        <RepFotoCard />
      </Stack>
    </Container>
  );
};
