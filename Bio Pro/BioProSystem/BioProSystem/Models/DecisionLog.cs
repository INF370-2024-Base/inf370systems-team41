using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class DecisionLog
{
    [Key]
    public int DecisionLogId { get; set; }

    public string DecisionLogState { get; set; } = null!;

    public string Justification { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
