using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderDirectionState
{
    [Key]
    public int OrderDirectionStateId { get; set; }

    public string? StateDescription { get; set; }

    public virtual ICollection<OrderDirection> OrderDirections { get; set; } = new List<OrderDirection>();
}
