using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class ProceduralTimeline
{
    [Key]
    public int ProceduralTimelineId { get; set; }
    public int CalanderId { get; set; }
    [Required]
    public string TimelineDetail { get; set; } = null!;
    [Required]
    public DateTime TimeStamp { get; set; }
    public DateTime LatestDateTime { get; set; }
    public DateTime EarliestDateTime { get; set; }
    public virtual ICollection<OrderWorkflowTimeline> OrderWorkflowTimeline { get; set; } = new List<OrderWorkflowTimeline>();
    public virtual Calander Calander { get; set; } = null!;
}
