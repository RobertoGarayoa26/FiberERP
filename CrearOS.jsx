import React, { useEffect, useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AppTheme from "../../Components/Shared-theme/AppTheme";
import {
  Box,
  Button,
  Card as MuiCard,
  FormControl,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import ColorModeSelect from "../../Components/Shared-theme/ColorModeSelect";
import CssBaseline from "@mui/material/CssBaseline";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { FormHelperText } from "@mui/material";

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

const AssignmentContainer = styled(Stack)(({ theme }) => ({
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

export const CrearOrdenServicio = (...props) => {
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoAsignado, setTecnicoAsignado] = useState("");
  const [errors, setErrors] = useState({});

  //Obtenemos la lista de técnicos desde la BD con autenticación
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://localhost:44327/api/users2/tecnicos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setTecnicos(res.data))
      .catch((error) =>
        console.error("Error al obtener lista de técnicos:", error)
      );
  }, []);

  const [formData, setFormData] = useState({
    NombreCliente: "",
    ApellidoCliente: "",
    telCliente: "",
    fechaProgram: "",
    tipoServicio: "",
    EstadoCliente: "",
    CiudadCliente: "",
    ColoniaCliente: "",
    CalleCliente: "",
    Division: "",
    Division2: "",
    Area: "",
    Cope: "",
    Distrito: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDateChange = (name) => (newValue) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const ValidateForms = () => {
    const newErrors = {};

    if (!tecnicoAsignado) newErrors.tecnicoAsignado = "Selecciona un técnico.";
    if (!formData.NombreCliente.trim())
      newErrors.NombreCliente = "El nombre es requerido.";
    if (!formData.ApellidoCliente.trim())
      newErrors.ApellidoCliente = "El apellido es requerido.";
    if (!formData.telCliente.trim() || !/^\d{10}$/.test(formData.telCliente))
      newErrors.telCliente = "Teléfono inválido (debe tener 10 dígitos).";
    if (!formData.fechaProgram || isNaN(Date.parse(formData.fechaProgram)))
      newErrors.fechaProgram = "Fecha de programación no válida.";
    if (!formData.tipoServicio)
      newErrors.tipoServicio = "Tipo de servicio no reconocido.";
    if (!formData.EstadoCliente)
      newErrors.EstadoCliente = "Estado no reconocido.";
    if (!formData.CiudadCliente)
      newErrors.CiudadCliente = "Ciudad no reconocida.";
    if (!formData.ColoniaCliente)
      newErrors.ColoniaCliente = "Colonia no reconocida.";
    if (!formData.CalleCliente) newErrors.CalleCliente = "Calle no reconocida.";
    if (!formData.Division) newErrors.Division = "División no reconocida.";
    if (!formData.Division2) newErrors.Division2 = "División 2 no reconocida.";
    if (!formData.Area) newErrors.Area = "Área no reconocida.";
    if (!formData.Cope) newErrors.Cope = "COPE no reconocido.";
    if (!formData.Distrito || !formData.Distrito.trim())
      newErrors.Distrito = "Código de distrito no reconocido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!ValidateForms()) {
      alert("Por favor, corrige los errores en el formulario.");
      return;
    }

    const nuevaOrdenServicio = {
      NombreCliente: formData.NombreCliente,
      ApellidoCliente: formData.ApellidoCliente,
      telCliente: formData.telCliente,
      fechaProgram: formData.fechaProgram,
      estatus: "Agendado",
      tipoServicio: formData.tipoServicio,
      EstadoCliente: formData.EstadoCliente,
      CiudadCliente: formData.CiudadCliente,
      ColoniaCliente: formData.ColoniaCliente,
      CalleCliente: formData.CalleCliente,
      Division: formData.Division,
      Division2: formData.Division2,
      Area: formData.Area,
      Cope: formData.Cope,
      Distrito: formData.Distrito,
      ID_Usuario: tecnicoAsignado,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "https://localhost:44327/api/ordenservicio",
        nuevaOrdenServicio,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("OS registrada: ", response.data);
      alert("OS registrada exitosamente!");

      // Limpieza del formulario
      setFormData({
        NombreCliente: "",
        ApellidoCliente: "",
        telCliente: "",
        fechaProgram: "",
        tipoServicio: "",
        EstadoCliente: "",
        CiudadCliente: "",
        ColoniaCliente: "",
        CalleCliente: "",
        Division: "",
        Division2: "",
        Area: "",
        Cope: "",
        Distrito: "",
      });
      setTecnicoAsignado("");
      setErrors({});
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

  //Catálogo de Divisiones
  const Division = [
    { title: "METRO" },
    { title: "SUR" },
    { title: "OCCIDENTE" },
    { title: "NORTE" },
  ];

  //Catálogo de Division2
  const Division2 = [
    { title: "METRO NORTE" },
    { title: "METRO SUR" },
    { title: "GOLFO" },
    { title: "SURESTE" },
    { title: "CENTRO" },
    { title: "OCCIDENTE" },
    { title: "NORESTE" },
    { title: "NOROESTE" },
  ];

  //Catálogo de Áreas
  const Area = [
    { title: "ACAPULCO" },
    { title: "AGUASCALIENTES" },
    { title: "BALBUENA" },
    { title: "CANCÚN" },
    { title: "CELAYA" },
    { title: "CHIHUAHUA" },
    { title: "CHILPANCINGO" },
    { title: "CIUDAD JUÁREZ" },
    { title: "CIUDAD OBREGÓN" },
    { title: "CIUDAD VICTORIA" },
    { title: "COATZACOALCOS" },
    { title: "COLIMA" },
    { title: "CÓRDOBA" },
    { title: "CULIACÁN" },
    { title: "CUAUTITLÁN-MORELOS" },
    { title: "CUERNAVACA" },
    { title: "DURANGO" },
    { title: "ECATEPEC" },
    { title: "ERMITA-TLAHUAC" },
    { title: "GUADALAJARA" },
    { title: "HERMOSILLO" },
    { title: "IRAPUATO" },
    { title: "JALAPA" },
    { title: "JALISCO" },
    { title: "LA PAZ" },
    { title: "LEÓN" },
    { title: "LINDAVISTA" },
    { title: "LOMAS" },
    { title: "LOS MOCHIS" },
    { title: "MATAMOROS" },
    { title: "MAZATLÁN" },
    { title: "MÉRIDA" },
    { title: "MIXCOAC" },
    { title: "MONTERREY I" },
    { title: "MONTERREY II" },
    { title: "MONTERREY III" },
    { title: "MORELIA" },
    { title: "NOGALES" },
    { title: "NUEVO LAREDO" },
    { title: "OAXACA" },
    { title: "PACHUCA" },
    { title: "POZA RICA" },
    { title: "PUEBLA" },
    { title: "PUERTO VALLARTA" },
    { title: "QUERÉTARO" },
    { title: "REYNOSA" },
    { title: "SABINAS" },
    { title: "SALTILLO" },
    { title: "SAN LUIS POTOSÍ" },
    { title: "SATELITE" },
    { title: "SOTELO" },
    { title: "TAMPICO" },
    { title: "TEXCOCO-ZARAGOZA" },
    { title: "TEPIC" },
    { title: "TLAXCALA" },
    { title: "TOLUCA" },
    { title: "TORREÓN" },
    { title: "TUXTLA GUTIERREZ" },
    { title: "UNIVERSIDAD" },
    { title: "VALLE SAN JUAN" },
    { title: "VERACRUZ" },
    { title: "VILLAHERMOSA" },
    { title: "ZACATECAS" },
    { title: "ZAMORA" },
  ];

  const TipoServicio = [
    { title: "Fibra Óptica" },
    { title: "Cobre" },
    { title: "Cambaceo" },
  ];

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <AssignmentContainer
        direction="column"
        justifyContent="space-between"
        maxWidth="md"
        sx={{ mt: 4 }}
      >
        <Card
          sx={{ width: "100%", maxWidth: 900, margin: "auto" }}
          variant="outlined"
        >
          {/* Ícono y título */}
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
                Añadir OS
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
            {/* Titulo Sección: Datos del técnico asignado */}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              TÉCNICO ASIGNADO
            </Typography>

            <Grid container spacing={3} sx={{ mb: 2 }}>
              {/* Campo Técnico Asignado */}
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  sx={{ mb: 2 }}
                  error={!!errors.tecnicoAsignado}
                >
                  <FormLabel htmlFor="Tecnico">Técnico Asignado*</FormLabel>
                  <Select
                    id="Tecnico"
                    value={tecnicoAsignado}
                    onChange={(e) => setTecnicoAsignado(e.target.value)}
                    displayEmpty
                    color={errors.tecnicoAsignado ? "error" : "primary"}
                  >
                    <MenuItem value="" disabled>
                      Selecciona un técnico*
                    </MenuItem>
                    {tecnicos.map((tecnico) => (
                      <MenuItem key={tecnico.id} value={tecnico.id}>
                        {tecnico.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.tecnicoAsignado && (
                    <FormHelperText>{errors.tecnicoAsignado}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/***********************************************************/}

            {/* Titulo Sección: Datos de la OS */}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              DATOS DE LA OS
            </Typography>

            {/* Sección: Datos de la OS */}
            <Grid container spacing={2} padding={1}>
              {/* Campo Teléfono */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="telCliente">Teléfono Cliente*</FormLabel>
                  <TextField
                    id="telCliente"
                    name="telCliente"
                    value={formData.telCliente}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </FormControl>
              </Grid>

              {/* Campo Tipo de Servicio */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2, minWidth: 218 }}>
                  <FormLabel htmlFor="tipoServicio">
                    Tipo de Servicio*
                  </FormLabel>
                  <Select
                    id="tipoServicio"
                    labelId="tipoServicio-label"
                    name="tipoServicio"
                    value={formData.tipoServicio}
                    label="Tipo de Servicio"
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.tipoServicio}
                    helperText={errors.tipoServicio}
                    color={errors.tipoServicio ? "error" : "primary"}
                  >
                    {TipoServicio.map((item, index) => (
                      <MenuItem key={index} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Campo Fecha Programacion */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="fechaProgram">
                    Fecha Programación*
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={formData.fechaProgram || null}
                      onChange={handleDateChange("fechaProgram")}
                      renderInputs={(props) => (
                        <TextField
                          {...props}
                          id="fechaProgram"
                          name="fechaProgram"
                          required
                          fullWidth
                          error={!!errors.fechaProgram}
                          helperText={errors.fechaProgram}
                          color={errors.fechaProgram ? "error" : "primary"}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
            </Grid>
            {/*************************************************************/}
            {/* Título Sección: Datos del Contratante */}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              DATOS DEL CONTRATANTE
            </Typography>
            {/* Sección Datos del Contratante */}
            <Grid container spacing={3} sx={{ mb: 2 }}>
              {/* Campo Nombre Cliente */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="NombreCliente">Nombre*</FormLabel>
                  <TextField
                    id="NombreCliente"
                    name="NombreCliente"
                    value={formData.NombreCliente}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.NombreCliente}
                    helperText={errors.NombreCliente}
                    color={errors.NombreCliente ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Apellido Cliente */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="ApellidoCliente">Apellido*</FormLabel>
                  <TextField
                    id="ApellidoCliente"
                    name="ApellidoCliente"
                    value={formData.ApellidoCliente}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.ApellidoCliente}
                    helperText={errors.ApellidoCliente}
                    color={errors.ApellidoCliente ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Estado Cliente */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="EstadoCliente">Estado Cliente*</FormLabel>
                  <TextField
                    id="EstadoCliente"
                    name="EstadoCliente"
                    value={formData.EstadoCliente}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.EstadoCliente}
                    helperText={errors.EstadoCliente}
                    color={errors.EstadoCliente ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Ciudad Cliente */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="CiudadCliente">Ciudad Cliente*</FormLabel>
                  <TextField
                    id="CiudadCliente"
                    name="CiudadCliente"
                    value={formData.CiudadCliente}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.CiudadCliente}
                    helperText={errors.CiudadCliente}
                    color={errors.CiudadCliente ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Colonia Cliente */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="ColoniaCliente">
                    Colonia Cliente*
                  </FormLabel>
                  <TextField
                    id="ColoniaCliente"
                    name="ColoniaCliente"
                    value={formData.ColoniaCliente}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.ColoniaCliente}
                    helperText={errors.ColoniaCliente}
                    color={errors.ColoniaCliente ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Calle Cliente */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="CalleCliente">Calle Cliente*</FormLabel>
                  <TextField
                    id="CalleCliente"
                    name="CalleCliente"
                    value={formData.CalleCliente}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.CalleCliente}
                    helperText={errors.CalleCliente}
                    color={errors.CalleCliente ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Division */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2, minWidth: 218 }}>
                  <FormLabel htmlFor="division">División*</FormLabel>
                  <Select
                    id="division"
                    labelId="division-label"
                    name="Division"
                    value={formData.Division}
                    label="División"
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.Division}
                    helperText={errors.Division}
                    color={errors.Division ? "error" : "primary"}
                  >
                    {Division.map((item, index) => (
                      <MenuItem key={index} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Campo Division 2 */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2, minWidth: 218 }}>
                  <FormLabel htmlFor="division2">División 2*</FormLabel>
                  <Select
                    id="division2"
                    labelId="division2-label"
                    name="Division2"
                    value={formData.Division2}
                    label="División 2"
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.Division2}
                    helperText={errors.Division2}
                    color={errors.Division2 ? "error" : "primary"}
                  >
                    {Division2.map((item, index) => (
                      <MenuItem key={index} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Campo Area */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2, minWidth: 218 }}>
                  <FormLabel htmlFor="area">Área*</FormLabel>
                  <Select
                    id="area"
                    labelId="area-label"
                    name="Area"
                    value={formData.Area}
                    label="Área"
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.Area}
                    helperText={errors.Area}
                    color={errors.Area ? "error" : "primary"}
                  >
                    {Area.map((item, index) => (
                      <MenuItem key={index} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Campo Cope */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="Cope">COPE*</FormLabel>
                  <TextField
                    name="Cope"
                    value={formData.Cope}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.Cope}
                    helperText={errors.Cope}
                    color={errors.Cope ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>

              {/* Campo Distrito */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <FormLabel htmlFor="Distrito">Distrito*</FormLabel>
                  <TextField
                    name="Distrito"
                    value={formData.Distrito}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.Distrito}
                    helperText={errors.Distrito}
                    color={errors.Distrito ? "error" : "primary"}
                  />
                </FormControl>
              </Grid>
            </Grid>
            {/*******************************************************************/}
            {/* Botón: Registrar OS */}
            <Grid container spacing={2} padding={1}></Grid>
            <Button type="submit" variant="contained" fullWidth>
              Registrar OS
            </Button>
          </Box>
        </Card>
      </AssignmentContainer>
    </AppTheme>
  );
};
