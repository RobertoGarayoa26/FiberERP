import React, { useEffect, useState } from "react";
import AppTheme from "../../Components/Shared-theme/AppTheme";
import {
  Box,
  Button,
  Card as MuiCard,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import ColorModeSelect from "../../Components/Shared-theme/ColorModeSelect";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  maxWidth: "800px",
  padding: theme.spacing(5),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6),
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const AltaUsuariosContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1-var(--template-frame-height, 0))*100dvh)",
  padding: theme.spacing(2),
  justifyContent: "center",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100% 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export const AltaUsuarios = (...props) => {
  const [formData, setFormData] = useState({
    NombreUsuario: "",
    ApellidoPatUsuario: "",
    ApellidoMatUsuario: "",
    ID_Perfil: "",
    RFC: "",
    IDMEX: "",
    NSS: "",
    Password: "",
    Telefono: "",
    Correo: "",
    Activo: true,
  });

  const [perfiles, setPerfiles] = useState([]);
  const [errors, setErrors] = useState({});

  // Obtener perfiles desde backend con token
  useEffect(() => {
    const fetchPerfiles = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "https://localhost:44327/api/Perfiles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPerfiles(response.data);
      } catch (error) {
        console.error("Error al obtener perfiles:", error);
        alert("Error al obtener perfiles. Asegúrate de que estás autenticado.");
      }
    };

    fetchPerfiles();
  }, []);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Validación del formulario
  const ValidateForm = () => {
    const newErrors = {};

    if (!formData.NombreUsuario.trim())
      newErrors.NombreUsuario = "El nombre es requerido.";
    if (!formData.ApellidoPatUsuario.trim())
      newErrors.ApellidoPatUsuario = "El apellido paterno es requerido.";
    if (!formData.ApellidoMatUsuario.trim())
      newErrors.ApellidoMatUsuario = "El apellido materno es requerido.";
    if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i.test(formData.RFC))
      newErrors.RFC = "RFC inválido (debe contener 13 caracteres).";
    if (!formData.IDMEX.trim() || formData.IDMEX.length !== 15)
      newErrors.IDMEX = "IDMEX inválido (debe contener 15 caracteres).";
    if (!formData.NSS || isNaN(formData.NSS) || formData.NSS.length !== 11)
      newErrors.NSS = "NSS inválido (debe contener 11 dígitos).";
    if (!formData.Password || formData.Password.length < 6)
      newErrors.Password = "La contraseña debe tener al menos 6 caracteres.";
    if (!formData.Telefono.trim() || !/^\d{10}$/.test(formData.Telefono))
      newErrors.Telefono = "Teléfono inválido (debe tener 10 dígitos).";
    if (!formData.Correo.trim() || !/\S+@\S+\.\S+/.test(formData.Correo))
      newErrors.Correo = "Correo electrónico inválido.";
    if (!formData.ID_Perfil) newErrors.ID_Perfil = "Selecciona un perfil.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario con token
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!ValidateForm()) {
      alert("Por favor, corrige los errores en el formulario.");
      return;
    }

    const nuevoUsuario = {
      NombreUsuario: formData.NombreUsuario,
      ApellidoPatUsuario: formData.ApellidoPatUsuario,
      ApellidoMatUsuario: formData.ApellidoMatUsuario,
      ID_Perfil: parseInt(formData.ID_Perfil),
      RFC: formData.RFC,
      IDMEX: formData.IDMEX,
      NSS: parseInt(formData.NSS),
      Password: formData.Password,
      Telefono: formData.Telefono,
      Correo: formData.Correo,
      Activo: formData.Activo,
    };

    console.log("Datos a enviar: ", formData);
    console.log("Objeto final: ", nuevoUsuario);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://localhost:44327/api/users2",
        nuevoUsuario,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Usuario registrado: ", response.data);
      alert("Usuario registrado exitosamente!");

      // Resetear formulario
      setFormData({
        NombreUsuario: "",
        ApellidoPatUsuario: "",
        ApellidoMatUsuario: "",
        ID_Perfil: "",
        RFC: "",
        IDMEX: "",
        NSS: "",
        Password: "",
        Telefono: "",
        Correo: "",
        Activo: true,
      });
    } catch (error) {
      if (error.response) {
        console.error("Error del servidor: ", error.response.data);
        alert("Error del servidor: " + JSON.stringify(error.response.data));
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor: ", error.request);
        alert("No se recibió respuesta del servidor");
      } else {
        console.error("Error al hacer la solicitud: ", error.message);
        alert("Error al hacer la solicitud: " + error.message);
      }
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <AltaUsuariosContainer
        direction="column"
        justifyContent="space-between"
        maxWidth="md"
        sx={{ mt: 4 }}
      >
        <Card
          sx={{ width: "100%", maxWidth: 900, margin: "auto" }}
          variant="outlined"
        >
          {/* Ícono y Título */}
          <Box>
            <Grid item xs={12} sm={6}>
              <Typography
                component="h4"
                variant="h1"
                sx={{
                  width: "100%",
                  fontSize: "clamp(1.5rem, 5vw, 2.25rem)",
                  mb: 2,
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                Alta de Usuarios
              </Typography>
            </Grid>
          </Box>

          {/* Formulario */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
              mt: 2,
            }}
          >
            {/* Título Sección: Información General */}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Información General
            </Typography>

            {/* Sección Información General */}
            <Grid container spacing={2} padding={1}>
              {/* Campo Nombre */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel htmlFor="NombreUsuario">Nombre(s)*</FormLabel>
                  <TextField
                    name="NombreUsuario"
                    value={formData.NombreUsuario}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.NombreUsuario}
                    helperText={errors.NombreUsuario}
                    color={errors.NombreUsuario ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Apellido Paterno */}
              <Grid item xs={2} sm={6}>
                <FormControl>
                  <FormLabel htmlFor="ApellidoPatUsuario">
                    Apellido Paterno*
                  </FormLabel>
                  <TextField
                    name="ApellidoPatUsuario"
                    value={formData.ApellidoPatUsuario}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.ApellidoPatUsuario}
                    helperText={errors.ApellidoPatUsuario}
                    color={errors.ApellidoPatUsuario ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Apellido Materno */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel htmlFor="ApellidoMatUsuario">
                    Apellido Materno*
                  </FormLabel>
                  <TextField
                    name="ApellidoMatUsuario"
                    value={formData.ApellidoMatUsuario}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.ApellidoMatUsuario}
                    helperText={errors.ApellidoMatUsuario}
                    color={errors.ApellidoMatUsuario ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo RFC */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel htmlFor="RFC">RFC*</FormLabel>
                  <TextField
                    name="RFC"
                    value={formData.RFC}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.RFC}
                    helperText={errors.RFC}
                    color={errors.RFC ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo IDMEX */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel htmlFor="IDMEX">IDMEX*</FormLabel>
                  <TextField
                    label="IDMEX123..."
                    name="IDMEX"
                    value={formData.IDMEX}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.IDMEX}
                    helperText={errors.IDMEX}
                    color={errors.IDMEX ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo NSS */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel htmlFor="NSS">NSS*</FormLabel>
                  <TextField
                    name="NSS"
                    value={formData.NSS}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                    error={!!errors.NSS}
                    helperText={errors.NSS}
                    color={errors.NSS ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>
            </Grid>

            {/*******************************************************************/}

            {/* Título Sección: Accesos */}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Accesos
            </Typography>

            {/* Sección Accesos */}
            <Grid container spacing={2} padding={1}>
              {/* Campo Password */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required sx={{ mb: 2, minWidth: 218 }}>
                  <FormLabel htmlFor="Password">Contraseña</FormLabel>
                  <TextField
                    name="Password"
                    type="password"
                    placeholder="******"
                    value={formData.Password}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.Password}
                    helperText={errors.Password}
                    color={errors.Password ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Perfil */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required sx={{ mb: 2, minWidth: 218 }}>
                  <FormLabel htmlFor="perfil-label">Perfil</FormLabel>
                  <Select
                    labelId="perfil-label"
                    name="ID_Perfil"
                    value={formData.ID_Perfil}
                    label="Perfil"
                    onChange={handleChange}
                    required
                    fullWidth
                    sx={{ width: 280 }}
                  >
                    {perfiles.map((perfil) => (
                      <MenuItem key={perfil.id} value={perfil.id}>
                        {perfil.nombrePerfil}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/*******************************************************************/}

            {/* Título Sección: Contacto Usuario */}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Contacto Usuario
            </Typography>

            {/* Sección Contacto Usuario */}
            <Grid container spacing={2} padding={1}>
              {/* Campo Teléfono */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel htmlFor="Telefono">Teléfono*</FormLabel>
                  <TextField
                    name="Telefono"
                    value={formData.Telefono}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </FormControl>
              </Grid>

              {/* Campo Correo */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel htmlFor="Correo">Correo*</FormLabel>
                  <TextField
                    name="Correo"
                    value={formData.Correo}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="email"
                    placeholder="correo@ejemplo.com"
                  />
                </FormControl>
              </Grid>
            </Grid>

            {/*******************************************************************/}

            {/* Botón: Registrar usuario */}
            <Grid container spacing={2} padding={1}></Grid>
            <Button type="submit" variant="contained" fullWidth>
              Registrar Usuario
            </Button>
          </Box>
        </Card>
      </AltaUsuariosContainer>
    </AppTheme>
  );
};
