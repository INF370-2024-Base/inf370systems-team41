using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class CalanderScheduleEvent
{
    [Key]
    public int CalanderScheduleEventId { get; set; }

    public DateTime CalanderScheduleEventDate { get; set; }

    public string Description { get; set; } = null!;

    public virtual ICollection<Calander> Calanders { get; set; } = new List<Calander>();
}
