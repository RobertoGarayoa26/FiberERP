using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using fiber_erp_dev1.Models;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PerfilesController : ControllerBase
{
    private readonly ServiceDBContext _context;

    public PerfilesController(ServiceDBContext context)
    {
        _context = context;
    }

    //GET: api/perfiles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Perfiles>>> GetPerfiles()
    {
        return await _context.Perfiles.ToListAsync();
    }

    //POST: api/perfiles
    [HttpPost]
    public async Task<ActionResult<Perfiles>> PostPerfiles(Perfiles perfil)
    {
        _context.Perfiles.Add(perfil);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetPerfiles", new { id = perfil.ID }, perfil);
    }

}
