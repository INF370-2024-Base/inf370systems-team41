using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Calander
{
    [Key]
    public int CalanderId { get; set; }

    public int TimelineId { get; set; }

    [Required]

    public string Title { get; set; } = null!;

    public virtual ICollection<CalanderScheduleEvent>? Events { get; set; } = new List<CalanderScheduleEvent>();
    public virtual ICollection<ProceduralTimeline>? Timeline { get; set; } = new List<ProceduralTimeline>();
}
