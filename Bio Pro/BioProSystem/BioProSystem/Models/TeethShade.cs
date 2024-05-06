using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class TeethShade
{
    [Key]
    public int TeethShadeId { get; set; }

    public string Colour { get; set; } = null!;

    public string ColourCode { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
