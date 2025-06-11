using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace fiber_erp_dev1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("protected")]
        [Authorize]
        public IActionResult GetProtectedData()
        {
            return (Ok(new { message = "Acceso autorizado con token JWT!" }));
        }
    }
}
