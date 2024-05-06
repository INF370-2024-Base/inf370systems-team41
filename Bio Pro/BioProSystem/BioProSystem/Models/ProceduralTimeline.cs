using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class ProceduralTimeline
{
    [Key]
    public int ProceduralTimelineId { get; set; }

    public string TimelineDetail { get; set; } = null!;

    public DateTime TimeStamp { get; set; }

    public virtual ICollection<Calander> Calanders { get; set; } = new List<Calander>();
}
