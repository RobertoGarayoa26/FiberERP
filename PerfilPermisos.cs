using System.ComponentModel.DataAnnotations.Schema;

namespace fiber_erp_dev1.Models
{
    public class PerfilPermisos
    {
        public int Id { get; set; }
        public int PerfilId { get; set; }
        public int PermisoId { get; set; }

        [ForeignKey("PermisoId")]
        public Permisos Permisos { get; set; }

        [ForeignKey("PerfilId")]
        public Perfiles Perfiles { get; set; }
    }
}
