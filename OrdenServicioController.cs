using fiber_erp_dev1.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdenServicioController : ControllerBase
{
    private readonly ServiceDBContext _context;
    private static readonly Random _random = new();

    public OrdenServicioController(ServiceDBContext context)
    {
        _context = context;
    }

    //Generación de folio_Os aleatorio y único
    private int FolioUnico()
    {
        int folioOS;
        bool existe;

        do
        {
            folioOS = _random.Next(100000, 999999);
            existe = _context.OrdenesServicio.Any(o => o.Folio_Os == folioOS);
        } while (existe);

        return folioOS;
    }

    //GET: api/OrdenServicio
    [HttpGet]
    public async Task<IActionResult> GetAssignments()
    {
        var ordenes = await _context.OrdenesServicio
            .Include(o => o.Users2) //Carga la relacion con Perfil
            .Select(o => new
            {
                o.ID,
                o.Folio_Os,
                o.NombreCliente,
                o.ApellidoCliente,
                o.TelCliente,
                o.CalleCliente,
                o.ColoniaCliente,
                o.CiudadCliente,
                o.EstadoCliente,
                o.Area,
                o.Cope,
                o.Distrito,
                o.Division,
                o.Division2,
                o.FechaProgram,
                o.FechaEjec,
                o.Estatus,
                o.TipoServicio,
                o.ID_Usuario,
                nombreTecnico = o.Users2.NombreUsuario + " " + o.Users2.ApellidoPatUsuario  // ← Aquí extraes el nombre del técnico
            })
            .ToListAsync();

        return Ok(ordenes);
    }

    //POST: api/OrdenesServicio
    [HttpPost]
    public async Task<IActionResult> CrearOrden([FromBody] OrdenesServicio orden)
    {
        try
        {
            //Validación de campos requeridos
            if (string.IsNullOrWhiteSpace(orden.NombreCliente))
            {
                return BadRequest("El nombre del cliente no puede estar vacío");
            }

            // Validación opcional: verificar si el usuario existe y está activo
            var usuario = await _context.Users2.FindAsync(orden.ID_Usuario);
            if (usuario == null || !usuario.Activo)
            {
                return BadRequest("El técnico asignado no existe o no está activo.");
            }

            //Asignar estatus automático
            if (orden.FechaProgram != null && orden.FechaProgram > DateTime.MinValue)
            {
                orden.Estatus = "Programado";
            }
            else
            {
                orden.Estatus = "Pendiente";
            }

            if (orden.FechaEjec == default(DateTime) || orden.FechaEjec == null)
            {
                orden.FechaEjec = orden.FechaProgram ?? DateTime.Now;
            }

            orden.Folio_Os = FolioUnico();

            _context.OrdenesServicio.Add(orden);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Orden de servicio creada correctamente", orden });
        
        } catch (Exception ex)
        {
            return StatusCode(500, $"Error al crear la orden de servicio: {ex.Message}");
        }
    }

    //PUT: api/ordenservicio/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> ActualizarOrden(int id, [FromBody] OrdenesServicio ordenActualizada)
    {
        if(id != ordenActualizada.ID)
        {
            return BadRequest("ID de la orden no coincide");
        }

        var ordenExistente = await _context.OrdenesServicio.FindAsync(id);
        if (ordenExistente == null)
        {
            return NotFound("Orden de servicio no encontrada");
        }

        var usuario = await _context.Users2.FindAsync(ordenActualizada.ID_Usuario);
        if(usuario == null)
        {
            return BadRequest("El técnico asignado no existe o no está activo");
        }

        //Actualizar campos
        ordenExistente.NombreCliente = ordenActualizada.NombreCliente;
        ordenExistente.ApellidoCliente = ordenActualizada.ApellidoCliente;
        ordenExistente.TelCliente = ordenActualizada.TelCliente;
        ordenExistente.CalleCliente = ordenActualizada.CalleCliente;
        ordenExistente.ColoniaCliente = ordenActualizada.ColoniaCliente;
        ordenExistente.CiudadCliente = ordenActualizada.CiudadCliente;
        ordenExistente.EstadoCliente = ordenActualizada.EstadoCliente;
        ordenExistente.Area = ordenActualizada.Area;
        ordenExistente.Cope = ordenActualizada.Cope;
        ordenExistente.Distrito = ordenActualizada.Distrito;
        ordenExistente.Division = ordenActualizada.Division;
        ordenExistente.Division2 = ordenActualizada.Division2;
        ordenExistente.FechaProgram = ordenActualizada.FechaProgram;
        ordenExistente.FechaEjec = ordenActualizada.FechaEjec;
        ordenExistente.Estatus = ordenActualizada.Estatus;
        ordenExistente.TipoServicio = ordenActualizada.TipoServicio;
        ordenExistente.ID_Usuario = ordenActualizada.ID_Usuario;

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Orden de servicio actualizada correctamente", orden = ordenExistente });
    }

    [HttpPut("{id}/estatus")]
    public async Task<IActionResult> ActualizarEstatus (int id, [FromBody] string nuevoEstatus)
    {
        try
        {
            var orden = await _context.OrdenesServicio.FindAsync(id);
            if (orden == null)
            {
                return NotFound("Orden no encontrada");
            }

            orden.Estatus = nuevoEstatus;

            //Si se cambia a "Ejecutado", registra fecha/hora actual
            if (nuevoEstatus == "Ejecutado")
            {
                orden.FechaEjec = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Estatus actualizado correctamente", orden });
        
        } catch (Exception ex)
        {
            return StatusCode(500, $"Error al actualizar el estatus: {ex.Message}");
        }
    }

    //DELETE: api/ordenservicio/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> EliminarOS(int id)
    {
        try
        {
            var orden = await _context.OrdenesServicio.FindAsync(id);
            if (orden == null)
            {
                return NotFound("Orden de servicio no encontrada");
            }

            _context.OrdenesServicio.Remove(orden);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Orden de servicio eliminada correctamente" });
        
        } catch (Exception ex)
        {
            return StatusCode(500, $"Error al eliminar la orden: {ex.Message}");
        }
    }
}
