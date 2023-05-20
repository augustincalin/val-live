using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ValLive.Core.Common;

namespace ValLive.Core.Model
{
    public class Valuation : Entity
    {
        public decimal MinRent { get; set; }
        public decimal MaxRent { get; set; }
        public decimal MinPrice { get; set; }
        public decimal MaxPrice { get; set; }
        public Coordinates? CurrentPosition { get; set; }
        public Coordinates? CheapPosition { get; set; }
        public Coordinates? ExpensivePosition { get; set; }

    }
}
