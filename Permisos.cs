using System.ComponentModel.DataAnnotations;

namespace fiber_erp_dev1.Models
{
    public class Permisos
    {
        public int ID { get; set; }

        [MaxLength(30)]
        public string Controlador { get; set; }

        [MaxLength(20)]
        public string Vista { get; set; }

        [MaxLength(50)]
        public string Accion {  get; set; }
    }
}
