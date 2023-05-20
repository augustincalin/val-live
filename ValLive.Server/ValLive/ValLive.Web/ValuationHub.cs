using Microsoft.AspNetCore.SignalR;
using ValLive.Core.Interfaces;
using ValLive.Core.Model;

namespace ValLive.Web
{
    public class ValuationHub : Hub
    {
        private readonly IValuationService _valuationService;
        public ValuationHub(IValuationService valuationService)
        {
            _valuationService = valuationService;
        }

        public async Task GetValuation(Coordinates location)
        {
            var valuation = await _valuationService.GetValuationAsync(location);
            await Clients.All.SendAsync("CalcValuation", valuation);
        }
    }
}
