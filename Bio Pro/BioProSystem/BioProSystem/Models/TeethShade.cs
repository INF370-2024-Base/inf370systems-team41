using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class TeethShade
{
    [Key]
    public int TeethShadeId { get; set; }
    [Required]
    public string Colour { get; set; } = null!;
    [Required]
    public string ColourName { get; set; } = null!;
    [Required]

    public string ColourCode { get; set; } = null!;

    public virtual ICollection<SystemOrder>? SystemOrders { get; set; } = new List<SystemOrder>();
}
