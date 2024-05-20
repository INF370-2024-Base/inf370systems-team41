using System;
using System.Collections.Generic;

namespace BioProSystem.ViewModels
{
    public class ProceduralTimelineViewModel
    {
        public int CalanderId { get; set; }
        public string TimelineDetail { get; set; }
        public List<string> OrderIds { get; set; }
        public int OrderDirectionId { get; set; }
    }
}
