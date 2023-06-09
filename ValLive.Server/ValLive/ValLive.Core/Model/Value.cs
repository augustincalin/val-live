﻿using ValLive.Core.Common;

namespace ValLive.Core.Model
{
    public class Value : Entity<int>
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}
