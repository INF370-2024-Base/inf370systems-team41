using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderWorkflowTimeline
{
    [Key]
    public int? WorkflowStructureId { get; set; }

    public int? TimelineId { get; set; }

    public int? OrderDetailId { get; set; }

    public virtual OrderDetail? OrderDetail { get; set; }

    public virtual ProceduralTimeline? Timeline { get; set; }

    public virtual WorkflowStructure? WorkflowStructure { get; set; }
}
