import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

export const UsersGrid = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  const listaPerfiles = [
    { id: 1, nombre: "Técnico Instalador" },
    { id: 2, nombre: "Líder de Cuadrilla" },
    { id: 3, nombre: "Coordinador Operativo" },
    { id: 4, nombre: "Administrativo" },
    { id: 5, nombre: "Gerente" },
  ];

  //Conexión al Backend con axios y token
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      console.log("Token: ", token);

      try {
        const response = await axios.get("https://localhost:44327/api/users2", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const users = response.data.map((row) => ({
          ...row,
          id: Number(row.id),
        }));

        setRows(users);
      } catch (error) {
        console.error("Error al obtener datos de usuarios: ", error);
        alert("Error al obtener datos de usuarios");
      }
    };

    fetchUsers();
  }, []);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  //Prepara el modelo de edición de un registro
  const handleEditClick = (id) => () => {
    setRowModesModel((old) => ({ ...old, [id]: { mode: GridRowModes.Edit } }));
  };

  //Función PUT para actualizar un registro
  const handleSaveClick = (id) => async () => {
    const row = rows.find((r) => r.id === id);

    if (!row) {
      alert("No se encontró el registro");
      return;
    }

    if (!row.nombreUsuario || !row.apellidoPatUsuario || !row.rfc) {
      alert("Faltan campos obligatorios");
      return;
    }

    const perfilEncontrado = listaPerfiles.find(
      (p) =>
        p.nombre.toLowerCase().trim() ===
        (row.perfil || "").toLowerCase().trim()
    );

    if (!perfilEncontrado) {
      alert("Perfil inválido");
      return;
    }

    const usuarioActualizado = {
      ID: row.id,
      NombreUsuario: row.nombreUsuario,
      ApellidoPatUsuario: row.apellidoPatUsuario,
      ApellidoMatUsuario: row.apellidoMatUsuario,
      ID_Perfil: perfilEncontrado.id,
      RFC: row.rfc,
      IDMEX: row.idmex,
      NSS: row.nss,
      Correo: row.correo,
      Telefono: row.telefono,
      Activo: row.activo,
    };

    if (row.password && row.password.trim() !== "") {
      usuarioActualizado.Password = row.password;
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token: ", token);
      await axios.put(
        `https://localhost:44327/api/users2/${id}`,
        usuarioActualizado,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Usuario actualizado: ", usuarioActualizado);
      setRowModesModel((old) => ({
        ...old,
        [id]: { mode: GridRowModes.View },
      }));

      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...row, perfil: perfilEncontrado.nombre } : r
        )
      );

      alert("Usuario actualizado exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el usuario: " + error.message);
    }
  };

  //Función DELETE para eliminar un registro
  const handleDeleteClick = (id) => async () => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este usuario?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://localhost:44327/api/users2/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      alert("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Error al eliminar usuario: " + error.message);
    }
  };

  //Función para cancelar la edición de un registro
  const handleCancelClick = (id) => () => {
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.View, ignoredModifications: true },
    }));
  };

  const processRowUpdate = async (newRow, oldRow) => {
    const perfilEncontrado = listaPerfiles.find(
      (p) => p.nombre === newRow.perfil
    );

    if (!perfilEncontrado) {
      alert("Debes elegir un perfil válido");
      return oldRow;
    }

    const dto = {
      ID: newRow.id,
      NombreUsuario: newRow.nombreUsuario,
      ApellidoPatUsuario: newRow.apellidoPatUsuario,
      ApellidoMatUsuario: newRow.apellidoMatUsuario,
      ID_Perfil: perfilEncontrado.id,
      RFC: newRow.rfc,
      IDMEX: newRow.idmex,
      NSS: newRow.nss,
      Password: newRow.password || undefined,
      Telefono: newRow.telefono,
      Correo: newRow.correo,
      Activo: newRow.activo ?? true,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `https://localhost:44327/api/users2/${dto.ID}`,
        dto,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data;
      alert("Usuario actualizado exitosamente");

      return {
        id: result.id || result.ID,
        nombreUsuario: result.nombreUsuario || result.NombreUsuario,
        apellidoPatUsuario:
          result.apellidoPatUsuario || result.ApellidoPatUsuario,
        apellidoMatUsuario:
          result.apellidoMatUsuario || result.ApellidoMatUsuario,
        perfil:
          listaPerfiles.find((p) => p.id === result.ID_Perfil)?.nombre ||
          "Desconocido",
        rfc: result.rfc || result.RFC,
        idmex: result.iDMEX || result.IDMEX,
        nss: result.nss || result.NSS,
        correo: result.correo || result.Correo,
        telefono: result.telefono || result.Telefono,
        activo: result.activo ?? result.Activo,
      };
    } catch (error) {
      console.error("Error en processRowUpdate: ", error);
      alert("Error en processRowUpdate: " + error.message);
      return oldRow;
    }
  };

  const handleRowModesModelChange = (newModel) => {
    setRowModesModel(newModel);
  };

  const columns = [
    {
      field: "nombreUsuario",
      headerName: "Nombre",
      width: 150,
      editable: true,
    },
    {
      field: "apellidoPatUsuario",
      headerName: "Apellido Paterno",
      width: 150,
      editable: true,
    },
    {
      field: "apellidoMatUsuario",
      headerName: "Apellido Materno",
      width: 150,
      editable: true,
    },
    {
      field: "perfil",
      headerName: "Perfil",
      width: 200,
    },
    {
      field: "rfc",
      headerName: "RFC",
      width: 150,
      editable: true,
    },
    {
      field: "idmex",
      headerName: "IDMEX",
      width: 150,
      editable: true,
    },
    {
      field: "nss",
      headerName: "NSS",
      width: 150,
      editable: true,
    },
    {
      field: "correo",
      headerName: "Correo",
      width: 250,
      editable: true,
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      width: 120,
      editable: true,
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
        LISTADO DE USUARIOS
      </Typography>

      {/* Botón para añadir usuarios */}
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
          onClick={() => navigate("/users/altausuarios")}
        >
          <Typography sx={{ fontWeight: "bold" }}>Añadir usuario</Typography>
        </Button>
      </Box>

      {/* Grid de usuarios */}
      <Box
        sx={{
          height: 400,
          width: "90%",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={undefined}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Stack>
  );
};
