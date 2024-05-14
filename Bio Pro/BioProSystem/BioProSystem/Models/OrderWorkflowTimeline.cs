using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderWorkflowTimeline
{
    [Key]
    public int WorkflowStructureId { get; set; }

    public int? TimelineId { get; set; }

    [Required] 
    public string SystemOrderId { get; set; }
    [Required]
    public int OrderDirectionId { get; set; }
    [Required]
    public string TimelineDetails { get; set; }

    public virtual ProceduralTimeline? Timeline { get; set; } = null!;

    public virtual SystemOrder systemOrder { get; set; } = null!;

    public virtual OrderDirection orderDirection { get; set; } = null!;
}
