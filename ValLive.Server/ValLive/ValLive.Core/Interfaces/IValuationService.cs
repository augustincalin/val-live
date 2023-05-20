using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ValLive.Core.Model;

namespace ValLive.Core.Interfaces
{
    public interface IValuationService
    {
        Task<Valuation> GetValuationAsync(Coordinates location);
    }
}
