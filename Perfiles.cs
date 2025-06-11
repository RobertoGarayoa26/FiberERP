using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace fiber_erp_dev1.Models
{
    public class Perfiles
    {
        [Key]
        public int ID { get; set; }

        [Required]
        [MaxLength(30)]
        public string NombrePerfil { get; set; }

        [JsonIgnore]
        public ICollection<Users2>? Users2 { get; set; }

        [JsonIgnore]
        public ICollection<PerfilPermisos>? Permisos { get; set; }
    }
}
