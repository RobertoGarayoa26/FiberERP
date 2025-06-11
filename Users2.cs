using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace fiber_erp_dev1.Models
{
    public class Users2
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        [Required, MaxLength(30)]
        public string NombreUsuario { get; set; }

        [MaxLength(30)]
        public string ApellidoPatUsuario { get; set; }

        [MaxLength(30)]
        public string ApellidoMatUsuario { get; set; }

        [ForeignKey("Perfil")]
        public int ID_Perfil { get; set; }
        public Perfiles? Perfil { get; set; }

        [MaxLength(15)]
        public string RFC { get; set; }

        [MaxLength(15)]
        public string IDMEX { get; set; }

        public long NSS { get; set; }

        [Required, MaxLength(25)]
        public string Password { get; set; }

        [Phone]
        [MaxLength(10)]
        public string Telefono { get; set; }

        [EmailAddress]
        [MaxLength(150)]
        public string Correo { get; set; }

        public bool Activo { get; set; } = true; //Indica si el usuario está activo

        public DateTime FechaRegistro { get; set; }

        [JsonIgnore]
        public ICollection<AsignacionServicio>? Asignaciones { get; set; }

        [JsonIgnore]
        public ICollection<OrdenesServicio> OrdenesServicios { get; set; } = new List<OrdenesServicio>();
    }
}
