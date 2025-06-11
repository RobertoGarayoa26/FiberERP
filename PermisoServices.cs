using fiber_erp_dev1.Models;
using Microsoft.EntityFrameworkCore;

namespace fiber_erp_dev1.Services
{
    public class PermisoServices
    {
        private readonly ServiceDBContext _context;

        public PermisoServices(ServiceDBContext context)
        {
            _context = context;
        }

        public async Task<bool> TienePermisoAsync(int perfilId, string controlador, string accion)
        {
            return await _context.PerfilPermisos
                .Include(pp => pp.Permisos)
                .AnyAsync(pp => pp.PerfilId == perfilId 
                            &&  pp.Permisos.Controlador == controlador 
                            &&  pp.Permisos.Accion == accion
                );
        }
    }
}
