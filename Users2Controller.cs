using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fiber_erp_dev1.Models;
using fiber_erp_dev1.Models.DTO;
using fiber_erp_dev1.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class Users2Controller : ControllerBase
{
    private readonly ServiceDBContext _context;
    private readonly PermisoServices _permisoService;

    public Users2Controller(ServiceDBContext context, PermisoServices permisoService)
    {
        _context = context;
        _permisoService = permisoService;
    }

    private string? ObtenerCorreoUser() => 
        User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

    private int? ObtenerPerfilId()
    {
        var claim = User.Claims.FirstOrDefault(c => c.Type == "PerfilId");
        return (claim != null && int.TryParse(claim.Value, out int perfilId)) ? perfilId : null;
    }

    //GET: api/Users2
    [HttpGet]
    public async Task<IActionResult> GetUsers2()
    {
        try
        {
            var perfilId = ObtenerPerfilId();
            if (perfilId == null || !(await _permisoService.TienePermisoAsync(perfilId.Value, "Users2", "Get")))
                return Forbid();

            var usuarios = await _context.Users2
                .Include(u => u.Perfil)
                .Where(u => u.Activo == true)
                .Select(u => new
                {
                    u.ID,
                    u.NombreUsuario,
                    u.ApellidoPatUsuario,
                    u.ApellidoMatUsuario,
                    Perfil = u.Perfil != null ? u.Perfil.NombrePerfil : "Sin Perfil",
                    u.RFC,
                    u.IDMEX,
                    u.NSS,
                    u.Telefono,
                    u.Correo,
                    u.Activo
                }).ToListAsync();

            return Ok(usuarios);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al obtener usuarios: {ex.Message}");
        }
    }

    //GET: api/Users2/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUsers2(int id)
    {
        var perfilId = ObtenerPerfilId();
        if (perfilId == null || !(await _permisoService.TienePermisoAsync(perfilId.Value, "Users2", "Get")))
            return Forbid();

        var usuario = await _context.Users2
            .Include(u => u.Perfil)
                .ThenInclude(p => p.Permisos!)
                    .ThenInclude(pp => pp.Permisos)
            .FirstOrDefaultAsync(u => u.ID == id);

        if (usuario == null)
            return NotFound();

        return Ok(new
        {
            usuario.ID,
            usuario.NombreUsuario,
            usuario.ApellidoPatUsuario,
            usuario.ApellidoMatUsuario,
            Perfil = usuario.Perfil?.NombrePerfil,
            Permisos = usuario.Perfil?.Permisos?.Select(p => new
            {
                p.Permisos.Controlador,
                p.Permisos.Accion
            }),
            usuario.RFC,
            usuario.IDMEX,
            usuario.NSS,
            usuario.Telefono,
            usuario.Correo,
            usuario.Activo
        });
    }


    //GET: api/users2/técnicos
    [HttpGet("tecnicos")]
    public async Task<IActionResult> GetTecnicos()
    {
        var perfilId = ObtenerPerfilId();
        if (perfilId == null || !(await _permisoService.TienePermisoAsync(perfilId.Value, "Users2", "Get")))
            return Forbid();

        var tecnicos = await _context.Users2
            .Where(u => u.ID_Perfil == 1 && u.Activo)
            .Select(u => new
            {
                id = u.ID,
                nombre = $"{u.NombreUsuario} {u.ApellidoPatUsuario} {u.ApellidoMatUsuario}"
            }).ToListAsync();

        return Ok(tecnicos);
    }


    //POST: api/users2
    [HttpPost]
    public async Task<IActionResult> PostUsers2([FromBody] Users2 usuario)
    {
        var perfilId = ObtenerPerfilId();
        if (perfilId == null || !(await _permisoService.TienePermisoAsync(perfilId.Value, "Users2", "Post")))
            return Forbid();

        if (string.IsNullOrWhiteSpace(usuario.NombreUsuario))
            return BadRequest("El nombre del usuario es obligatorio.");

        var perfilExiste = await _context.Perfiles.AnyAsync(p => p.ID == usuario.ID_Perfil);
        if (!perfilExiste)
            return BadRequest("El perfil asignado no existe.");

        var correoExiste = await _context.Users2.AnyAsync(u => u.Correo == usuario.Correo);
        if (correoExiste)
            return BadRequest("El correo ya está registrado.");

        usuario.FechaRegistro = DateTime.Now;

        _context.Users2.Add(usuario);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUsers2), new { id = usuario.ID }, usuario);
    }

    //PUT: api/usuarios/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutUsers2(int id, [FromBody] UserUpdateDTO dto)
    {
        var perfilId = ObtenerPerfilId();
        if (perfilId == null || !(await _permisoService.TienePermisoAsync(perfilId.Value, "Users2", "Put")))
        {
            return Forbid();
        }

        try
        {
            // Verifica que el ID del usuario a actualizar conincida con el ID de la URL
            if (id != dto.ID)
            {
                return BadRequest("El ID de usuario no coincide con el ID proporcionado en la URL");
            }

            // Verifica que el usuario exista en la BD
            var usuarioExistente = await _context.Users2
                .Include(u => u.Perfil)
                .FirstOrDefaultAsync(u => u.ID == id);

            if (usuarioExistente == null)
            {
                return NotFound($"No se encontró el usuario con ID = {id}");
            }

            // Actualizar SOLO los campos que vienen en el DTO
            usuarioExistente.NombreUsuario = dto.NombreUsuario;
            usuarioExistente.ApellidoPatUsuario = dto.ApellidoPatUsuario;
            usuarioExistente.ApellidoMatUsuario = dto.ApellidoMatUsuario;
            usuarioExistente.ID_Perfil = dto.ID_Perfil;
            usuarioExistente.RFC = dto.RFC;
            usuarioExistente.IDMEX = dto.IDMEX;
            usuarioExistente.NSS = dto.NSS;
            usuarioExistente.Telefono = dto.Telefono;
            usuarioExistente.Correo = dto.Correo;
            usuarioExistente.Activo = dto.Activo;

            await _context.SaveChangesAsync();

            //Devuelve los campos necesarios si es para frontend
            return Ok(new
            {
                mensaje = "Usuario actualizado correctamente",
                usuario = new
                {
                    id = usuarioExistente.ID,
                    nombreUsuario = usuarioExistente.NombreUsuario,
                    apellidoPatUsuario = usuarioExistente.ApellidoPatUsuario,
                    apellidoMatUsuario = usuarioExistente.ApellidoMatUsuario,
                    iD_Perfil = usuarioExistente.ID_Perfil,
                    rfc = usuarioExistente.RFC,
                    iDMEX = usuarioExistente.IDMEX,
                    nss = usuarioExistente.NSS,
                    telefono = usuarioExistente.Telefono,
                    correo = usuarioExistente.Correo,
                    activo = usuarioExistente.Activo
                }
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                mensaje = "Error interno del servidor al actualizar el usuario",
                error = ex.Message,
                inner = ex.InnerException?.Message
            });
        }
    }

    
    //DELETE: api/usuarios/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUsers2(int id)
    {
        var perfilId = ObtenerPerfilId();
        if (perfilId == null || !(await _permisoService.TienePermisoAsync(perfilId.Value, "Users2", "Delete")))
        {
            return Forbid();
        }

        try
        {
            // Buscar el usuario por ID
            var usuario = await _context.Users2.FindAsync(id);

            // Si no se encuentra, devolver 404
            if (usuario == null)
            {
                return NotFound($"No se encontró el usuario con ID: {id}");
            }

            // Remover logicamente el usuario del contexto
            usuario.Activo = false;

            // Guardar los cambios en la BD
            await _context.SaveChangesAsync();

            //Devolver el usuario eliminado como confirmación
            return Ok(usuario);
            //return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error al eliminar al usuario: {ex.Message}");
        }
    }
}