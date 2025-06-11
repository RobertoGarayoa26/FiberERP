import { useEffect } from "react";

export const LogOut = () => {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("permisos");
    window.location.href = "/login";
  }, []);

  return ("Cerrando sesión");
};
