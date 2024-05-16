using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderDirectionState
{
    [Key]
    public int OrderDirectionStateId { get; set; }
    [Required]

    public string StateDescription { get; set; }

    public decimal Ratio { get; set; }

    public int OrderDirectionsId { get; set; }
    public int JobTitleId { get; set; }
    public virtual OrderDirection OrderDirections { get; set; }
    public virtual JobTitle JobTitle { get; set; }
}
