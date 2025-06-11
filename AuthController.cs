using fiber_erp_dev1.Models;
using fiber_erp_dev1.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace fiber_erp_dev1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ServiceDBContext _context;
        private readonly JwtTokenService _jwtTokenService;

        public AuthController(ServiceDBContext context, JwtTokenService jwtTokenService)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
        }


        [HttpPost]
        [AllowAnonymous]
        public IActionResult Login([FromBody] Login model)
        {
            if (string.IsNullOrEmpty(model.Correo) || string.IsNullOrEmpty(model.Password))
                return BadRequest("Correo y contraseña requeridos");

            var user = _context.Users2.FirstOrDefault(u => u.Correo == model.Correo && u.Password == model.Password && u.Activo);

            if (user == null)
                return Unauthorized("Credenciales incorrectas");

            var permisos = (from pp in _context.PerfilPermisos
                            join p in _context.Permisos on pp.PermisoId equals p.ID
                            where pp.PerfilId == user.ID_Perfil
                            select new
                            {
                                p.Controlador,
                                p.Accion
                            }).ToList();

            var token = _jwtTokenService.GenerateToken(user);

            return Ok(new
            {
                Token = token,
                Usuario = new
                {
                    user.ID,
                    user.NombreUsuario,
                    user.Correo,
                    user.ID_Perfil
                },
                Permisos = permisos
            });
        }

    }
}
