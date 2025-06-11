import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import Person from "@mui/icons-material/Person";
import Dashboard from "@mui/icons-material/Dashboard";
import CurrencyExchange from "@mui/icons-material/CurrencyExchange";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DescriptionIcon from "@mui/icons-material/Description";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import CableIcon from "@mui/icons-material/Cable";
import LanIcon from "@mui/icons-material/Lan";
import ImageIcon from "@mui/icons-material/Image";


const NAVIGATION = [
  {
    kind: "header",
    title: "Módulos del sistema",
  },
  {
    segment: "homepage",
    title: "Inicio",
    icon: <HomeIcon />,
  },
  {
    segment: "users",
    title: "Usuarios",
    icon: <Person />,
  },
  {
    segment: "assignments",
    title: "Asignaciones",
    icon: <AssignmentIcon />,
    children: [
      {
        segment: "fibra_opt",
        title: "Fibra",
        icon: <CableIcon />,
      },
      {
        segment: "cobre",
        title: "Cobre",
        icon: <LanIcon/>
      },
      {
        segment: "cambaceo",
        title: "Cambaceo",
        icon: <Person/>
      },
    ],
  },
  {
    segment: "reports",
    title: "Reportes",
    icon: <DescriptionIcon />,
    children: [
      {
        segment: "reporte_tec",
        title: "Reporte Técnico",
        icon: <AssignmentIcon />
      },
      {
        segment: "reporte_foto",
        title: "Reporte Fotográfico",
        icon: <ImageIcon />
      }
    ],
  },
];

export default NAVIGATION;