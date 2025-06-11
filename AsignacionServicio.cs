namespace fiber_erp_dev1.Models
{
    public class AsignacionServicio
    {
        public int ID { get; set; }

        public int ID_OS { get; set; }
        public OrdenesServicio OrdenServicio { get; set; }

        public int ID_Usuario { get; set; }
        public Users2 Users2 { get; set; }
    }
}
