import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import NAVIGATION from "../Components/Navbar/Navigation";

import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { createTheme } from "@mui/material/styles";
import CableIcon from "@mui/icons-material/Cable";
import AccountCircle from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Logout } from "@mui/icons-material/Logout";

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    ></Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

export const DashboardLayoutBasic = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("usuario"));
  const [session, setSession] = useState(
    storedUser
      ? {
          user: {
            name: storedUser.nombreUsuario,
            email: storedUser.correo,
          },
        }
      : null
  );

  const authentication = useMemo(
    () => ({
      signIn: (user) => {
        setSession({ user });
      },
      signOut: () => {
        setSession(null);
      },
    }),
    []
  );

  if (location.pathname === "/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("permisos");
    authentication.signOut();
    navigate("/login");
  };

  const AppTitle = () => (
    <Stack direction="row" alignItems="center" spacing={2}>
      <CableIcon fontSize="large" style={{ color: "primary" }} />
      <Typography variant="h4" sx={{ color: "#FFC000", fontWeight: "bold" }}>
        FIBER ERP
      </Typography>
      <Chip size="small" label="BETA" color="info" />
    </Stack>
  );

  const ToolbarActions = () => (
    <Stack direction="row" spacing={2} alignItems="center">
      {session && (
        <Tooltip title={`${session.user.name} (${session.user.email})`}>
          <IconButton onClick={handleLogout} color="inherit">
            <AccountCircle fontSize="large" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={{ pathname: location.pathname, navigate }}
      theme={demoTheme}
    >
      <DashboardLayout
        slots={{
          appTitle: AppTitle,
          appBarContent: ToolbarActions,
        }}
      >
        {children}
      </DashboardLayout>
    </AppProvider>
  );
};
