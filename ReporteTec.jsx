import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useMovieData } from "@mui/x-data-grid-generator";

const VISIBLE_FIELDS = [
  "title",
  "company",
  "director",
  "year",
  "cinematicUniverse",
];

export const ReporteTecGrid = () => {
  const data = useMovieData();

  const columns = React.useMemo(
    () =>
      data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns]
  );

  return (
    <Stack direction="column" alignItems="center" spacing={3}>
      {/* Título de la página */}
      <Typography variant="h4" sx={{ color: "#0288D1", fontWeight: "bold" }}>
        REPORTES TÉCNICOS
      </Typography>

      {/* Botones para añadir y eliminar usuarios */}
      <Box
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "flex-start",
          gap: 2,
          width: "90%",
        }}
      >
        <Button variant="contained" color="success">
          <Typography sx={{ fontWeight: "bold" }}>Añadir reporte</Typography>
        </Button>
        <Button variant="contained" color="warning">
          <Typography sx={{ fontWeight: "bold" }}>Modificar reporte</Typography>
        </Button>
      </Box>
      <Box sx={{ height: 400, width: "90%" }}>
        <DataGrid
          {...data}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          colums={columns}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
        />
      </Box>
    </Stack>
  );
};
