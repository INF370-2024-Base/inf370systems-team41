using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderDirection
{
    [Key]
    public int OrderDirectionId { get; set; }

    public string Description { get; set; } = null!;

    public string Instruction { get; set; } = null!;

    public DateTime DueDate { get; set; }

    public int OrderDirectionStateId { get; set; }

    public DateTime OrderDate { get; set; }

    public string MouthArea { get; set; } = null!;

    public string? SpecialRequirements { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();

    public virtual OrderDirectionState OrderDirectionState { get; set; } = null!;
}
