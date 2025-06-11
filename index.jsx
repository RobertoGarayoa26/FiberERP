import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { DashboardLayoutBasic } from "./Home";
import { InicioView } from "./Inicio/InicioView";
import { AssignmentView } from "./Assignments/AssignmentsIndex";
import { CambaceoOSGrid } from "./Assignments/Cambaceo/CambaceoOS";
import { CobreOSGrid } from "./Assignments/Cobre/CobreOS";
import { FibraOSGrid } from "./Assignments/Fibra/FibraOS";
import { UsersGrid } from "./Users/Users";
import { AltaUsuarios } from "./Users/AltaUsuarios";
import { CrearOrdenServicio } from "./Assignments/CrearOS";
import { ReportsView } from "./Reports/ReportsIndex";
import { ReporteFotoGrid } from "./Reports/ReporteFoto/ReporteFoto";
import { ReporteTecGrid } from "./Reports/ReporteTec/ReporteTec";
import { ProtectedRoute } from "./ProtectedRoute";
import { LogIn } from "../ReactViews/LogIn"


export const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirección inicial */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login sin layout */}
        <Route path="/login" element={<LogIn />} />

        {/* Rutas protegidas con layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayoutBasic>
                <Routes>
                  <Route path="/homepage" element={<InicioView />} />
                  <Route path="/users" element={<UsersGrid />} />
                  <Route path="/users/altausuarios" element={<AltaUsuarios />} />
                  <Route path="/assignments" element={<AssignmentView />} />
                  <Route path="/assignments/crearOS" element={<CrearOrdenServicio />} />
                  <Route path="/assignments/fibra_opt" element={<FibraOSGrid />} />
                  <Route path="/assignments/cobre" element={<CobreOSGrid />} />
                  <Route path="/assignments/cambaceo" element={<CambaceoOSGrid />} />
                  <Route path="/reports" element={<ReportsView />} />
                  <Route path="/reports/reporte_foto" element={<ReporteFotoGrid />} />
                  <Route path="/reports/reporte_tec" element={<ReporteTecGrid />} />
                </Routes>
              </DashboardLayoutBasic>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
