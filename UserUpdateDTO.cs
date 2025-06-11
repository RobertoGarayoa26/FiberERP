namespace fiber_erp_dev1.Models.DTO
{
    public class UserUpdateDTO
    {
        public int ID { get; set; }
        public string NombreUsuario { get; set; }
        public string ApellidoPatUsuario { get; set; }
        public string ApellidoMatUsuario { get; set; }
        public int ID_Perfil { get; set; }
        public string RFC { get; set; }
        public string IDMEX { get; set; }
        public long NSS { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public bool Activo { get; set; }

    }
}
