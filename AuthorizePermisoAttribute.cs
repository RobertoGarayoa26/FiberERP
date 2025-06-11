using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;
using fiber_erp_dev1.Services;

namespace fiber_erp_dev1.Services
{
    [AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = true)]
    public class AuthorizePermisoAttribute : Attribute, IAsyncAuthorizationFilter
    {
        private readonly string _controlador;
        private readonly string _accion;

        public AuthorizePermisoAttribute(string controlador, string accion)
        {
            _controlador = controlador;
            _accion = accion;
        }

        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // Verifica si el usuario está autenticado
            if (!context.HttpContext.User.Identity.IsAuthenticated)
            {
                context.Result = new UnauthorizedResult();
                return;
            }

            // Obtiene el claim PerfilId
            var perfilIdClaim = context.HttpContext.User.FindFirst("PerfilId");

            if (perfilIdClaim == null || !int.TryParse(perfilIdClaim.Value, out int perfilId))
            {
                context.Result = new ForbidResult(); // No tiene perfil válido
                return;
            }

            // Obtiene el servicio desde el contenedor de dependencias
            var permisoService = context.HttpContext.RequestServices.GetService<PermisoServices>();

            if (permisoService == null)
            {
                context.Result = new StatusCodeResult(StatusCodes.Status500InternalServerError); // Servicio no disponible
                return;
            }

            // Verifica si tiene permiso
            bool tienePermiso = await permisoService.TienePermisoAsync(perfilId, _controlador, _accion);

            if (!tienePermiso)
            {
                context.Result = new ForbidResult(); // No tiene permiso
                return;
            }

            // Permiso concedido, se continúa la ejecución
        }
    }
}
