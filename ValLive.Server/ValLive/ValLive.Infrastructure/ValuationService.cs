using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ValLive.Core.Interfaces;
using ValLive.Core.Model;

namespace ValLive.Infrastructure
{
    public class ValuationService : IValuationService
    {
        public async Task<Valuation> GetValuationAsync(Coordinates location)
        {
            var randRent = new Random();
            var randPrice = new Random();

            var valuation = new Valuation
            {
                CurrentPosition = location,

                MinRent = randRent.Next(800, 2000),
                MaxRent = randRent.Next(1200, 2400),
                MinPrice = randPrice.Next(300_000, 3_000_000),
                MaxPrice = randPrice.Next(1_000_000, 10_000_000),
                CheapPosition = new Coordinates
                {
                    Longitude = location.Longitude + (randRent.NextDouble() - 0.5) / 1000,
                    Latitude = location.Latitude + (randRent.NextDouble() - 0.5) / 1000
                },
                ExpensivePosition = new Coordinates
                {
                    Longitude = location.Longitude + (randRent.NextDouble() - 0.5) / 1000,
                    Latitude = location.Latitude + (randRent.NextDouble() - 0.5) / 1000
                }
            };

            return await Task.FromResult(valuation);
        }
    }
}
