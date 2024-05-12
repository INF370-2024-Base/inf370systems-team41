using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class DecisionLog
{
    [Key]
    public int DecisionLogId { get; set; }

    [Required]
    public string DecisionLogState { get; set; } = null!;

    [Required]
    public string Justification { get; set; } = null!;

    public string SystemOrderId { get; set; }

    public virtual SystemOrder SystemOrder { get; set; } = null!;
}
