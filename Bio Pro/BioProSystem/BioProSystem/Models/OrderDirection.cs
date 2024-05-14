using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderDirection
{
    [Key]
    public int OrderDirectionId { get; set; }
    [Required]
    public string Description { get; set; } = null!;
    [Required]
    public string Instructions { get; set; } = null!;

    [Required]
    public int EstimatedDurationInDays { get; set; }

    public virtual ICollection<OrderWorkflowTimeline> OrderDetails { get; set; } = new List<OrderWorkflowTimeline>();

    public virtual ICollection<OrderDirectionState>  OrderDirectionSteps { get; set; } = new List<OrderDirectionState>();
}
