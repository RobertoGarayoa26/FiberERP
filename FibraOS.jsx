import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

export const FibraOSGrid = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rows, setRows] = React.useState([]);
  const [rowModesModel, setRowModesModel] = React.useState({});

  //Conexión al Backend
  React.useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("https://localhost:44327/api/ordenservicio", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Datos de la API: ", response.data);
        setRows(response.data.map((row) => ({ ...row, id: Number(row.id) })));
      })
      .catch((error) => {
        if (error.response) {
          console.error(
            "Error en la respuesta del servidor:",
            error.response.status,
            error.response.data
          );
        } else {
          console.error("Error al obtener datos:", error.message);
        }
      });
  }, []);

  //Manejo de eventos
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  //Función para editar un registro
  const handleEditClick = (id) => () => {
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit },
    }));
  };

  //Función para guardar un registro
  const handleSaveClick = (id) => async () => {
    const token = localStorage.getItem("token");
    const row = rows.find((r) => r.id === id);

    try {
      await axios.put(`https://localhost:44327/api/ordenservicio/${id}`, row, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setRowModesModel((oldModel) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.View },
      }));

      setRows((prevRows) =>
        prevRows.map((r) => (r.id === id ? { ...r, estatus: row.estatus } : r))
      );

      alert("OS actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar el estatus: ", error);
      alert("Error al actualizar el estatus: " + error.message);
    }
  };

  //Función para eliminar un registro
  const handleDeleteClick = (id) => async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este OS?")) {
      try {
        const token = localStorage.getItem("token");

        await axios.delete(`https://localhost:44327/api/ordenservicio/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
        alert("OS eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar OS: ", error);
        if (error.response) {
          alert(
            `Error al eliminar OS: ${error.response.data || error.response.statusText}`
          );
        } else {
          alert("Error al eliminar OS: " + error.message);
        }
      }
    }
  };

  //Función para cancelar la edición de un registro
  const handleCancelClick = (id) => () => {
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.View, ignoredModifications: true },
    }));
  };

  //Función para actualizar un registro
  const processRowUpdate = async (newRow, oldRow) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `https://localhost:44327/api/ordenservicio/${newRow.id}`,
        newRow,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Se actualizó el OS con éxito");

      return response.data;
    } catch (error) {
      console.error("Error en processRowUpdate: ", error);
      alert("Error en processRowUpdate: " + error.message);
      return oldRow;
    }
  };

  //Función para actualizar el modelo de edición de un registro
  const handleRowModesModelChange = (newModel) => {
    setRowModesModel(newModel);
  };

  //Función para detectar el filtro de tipo de servicio según la URL
  const tipoServicioFilter = (() => {
    if (location.pathname.includes("fibra_opt")) return "Fibra Óptica";
    if (location.pathname.includes("cobre")) return "Cobre";
    if (location.pathname.includes("cambaceo")) return "Cambaceo";
    return null;
  })();

  //Filtrar los registros según el tipo de servicio
  const rowsFiltered = tipoServicioFilter
    ? rows.filter((row) => row.tipoServicio === tipoServicioFilter)
    : rows;

  //Columnas de la tabla
  const columns = [
    {
      field: "folio_Os",
      headerName: "Folio OS",
      width: 100,
    },
    {
      field: "nombreCliente",
      headerName: "Nombre Cliente",
      width: 150,
    },
    {
      field: "apellidoCliente",
      headerName: "Apellido Cliente",
      width: 150,
    },
    {
      field: "telCliente",
      headerName: "Teléfono Cliente",
      width: 150,
    },
    {
      field: "nombreTecnico",
      headerName: "Técnico Asignado",
      width: 150,
    },
    {
      field: "fechaProgram",
      headerName: "Fecha Programación",
      width: 150,
      editable: true,
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD/MM/YYYY");
      },
    },
    {
      field: "fechaEjec",
      headerName: "Fecha Ejecución",
      width: 150,
      editable: true,
      valueFormatter: (params) => {
        return dayjs(params.value).format("DD/MM/YYYY");
      },
    },
    {
      field: "estatus",
      headerName: "Estatus",
      width: 150,
      editable: true,
    },
    {
      field: "tipoServicio",
      headerName: "Tipo de Servicio",
      width: 150,
    },
    {
      field: "estadoCliente",
      headerName: "Estado Cliente",
      width: 150,
    },
    {
      field: "ciudadCliente",
      headerName: "Ciudad Cliente",
      width: 150,
    },
    {
      field: "coloniaCliente",
      headerName: "Colonia Cliente",
      width: 150,
    },
    {
      field: "calleCliente",
      headerName: "Calle Cliente",
      width: 150,
    },
    {
      field: "division",
      headerName: "División",
      width: 150,
    },
    {
      field: "division2",
      headerName: "División 2",
      width: 150,
    },
    {
      field: "area",
      headerName: "Área",
      width: 150,
    },
    {
      field: "cope",
      headerName: "COPE",
      width: 150,
    },
    {
      field: "distrito",
      headerName: "Distrito",
      width: 150,
    },
    {
      field: "acciones",
      type: "actions",
      header: "Acciones",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Guardar"
              onClick={handleSaveClick(id)}
              color="primary"
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancelar"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Eliminar"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Stack direction="column" alignItems="center" spacing={3}>
      {/* Título de la página */}
      <Typography variant="h4" sx={{ color: "#0288D1", fontWeight: "bold" }}>
        OS - {tipoServicioFilter}
      </Typography>

      {/* Botones para añadir OS's */}
      <Box
        sx={{
          py: 4,
          display: "flex",
          justifyContent: "flex-start",
          gap: 2,
          width: "90%",
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/assignments/crearOS")}
        >
          <Typography sx={{ fontWeight: "bold" }}>Añadir asignación</Typography>
        </Button>
      </Box>

      {/* Grid de asignaciones registradas */}
      <Box
        sx={{
          height: 400,
          width: "90%",
          "& .actions": { color: "text.secondary" },
        }}
      >
        {rowsFiltered.length === 0 ? (
          <Typography>No hay registros para "{tipoServicioFilter}"</Typography>
        ) : (
          <DataGrid
            rows={rowsFiltered}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            experimentalFeatures={{ newEditingApi: true }}
            getRowId={(row) => row.id}
            onProcessRowUpdateError={(error) => {
              console.error(
                "Error en procesar la actualización de la fila: ",
                error
              );
              alert(
                "Error en procesar la actualización de la fila: " +
                  error.message
              );
            }}
          />
        )}
      </Box>
    </Stack>
  );
};
