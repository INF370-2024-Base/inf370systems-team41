using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Calander
{
    [Key]
    public int CalanderId { get; set; }

    public int? TimelineId { get; set; }

    public int? EventId { get; set; }

    public string Title { get; set; } = null!;

    public virtual CalanderScheduleEvent? Event { get; set; }

    public virtual ProceduralTimeline? Timeline { get; set; }
}
