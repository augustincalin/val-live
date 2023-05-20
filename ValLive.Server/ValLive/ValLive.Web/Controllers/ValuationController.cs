using Microsoft.AspNetCore.Mvc;
using ValLive.Core.Interfaces;
using ValLive.Core.Model;
using ValLive.Core.Services;

namespace ValLive.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ValuationController: ControllerBase
    {
        private readonly IValuationService _valuationService;

        public ValuationController(IValuationService valuationService)
        {
            _valuationService = valuationService;
        }

        [HttpPost]
        public async Task<IActionResult> GetValuation(Coordinates position)
        {
            return Ok(await _valuationService.GetValuationAsync(position));
        }
    }
}
