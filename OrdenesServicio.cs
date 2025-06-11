using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace fiber_erp_dev1.Models
{
    public class OrdenesServicio
    {
        public int ID { get; set; }

        public int Folio_Os { get; set; }

        public string TelCliente { get; set; }

        [MaxLength(30)]
        public string NombreCliente { get; set; }

        [MaxLength(30)]
        public string ApellidoCliente { get; set; }

        public bool EsMigracion {  get; set; } //Valores posibles para servicio: Migración ó Instalación
        
        public DateTime? FechaProgram {  get; set; }

        public DateTime? FechaEjec {  get; set; }

        public string Estatus { get; set; } //Agendado, Ejecutado, Objetado...

        public string TipoServicio { get; set; }

        [MaxLength(30)]
        public string EstadoCliente { get; set; } //Estado de residencia del Cliente

        [MaxLength(30)]
        public string CiudadCliente {  get; set; }

        [MaxLength(30)]
        public string ColoniaCliente { get; set; }

        [MaxLength(30)]
        public string CalleCliente { get; set; }

        [MaxLength(15)]
        public string Division {  get; set; } // METRO, SUR, ORIENTE, PONIENTE

        [MaxLength(15)]
        public string Division2 { get; set; } //METRO NORTE, METRO SUR...

        [MaxLength(25)]
        public string Area {  get; set; } // TOLUCA, ECATEPEC, SOTELO...

        [MaxLength(25)]
        public string Cope {  get; set; } // CT TICOMÁN, CT VALLEJO...

        [MaxLength(12)]
        public string Distrito { get; set; } //VDC00089

        public int ID_Usuario { get; set; }

        [ForeignKey("ID_Usuario")]
        [JsonIgnore]
        public Users2? Users2 { get; set; }

        [JsonIgnore]
        public ICollection<AsignacionServicio>? Asignaciones { get; set; }
    }
}
