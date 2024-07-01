using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class CalanderScheduleEvent
{
    [Key]
    public int CalanderScheduleEventId { get; set; }

    public DateTime CalanderScheduleEventDateTime { get; set; }

    public string? Information { get; set; }
    public string Description { get; set; } = null!;

    public int CalanderId { get; set; }

    public virtual Calander Calander { get; set; }
}
