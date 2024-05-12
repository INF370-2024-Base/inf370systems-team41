using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class StockItem
{
    [Key]
    public int StockId { get; set; }
    [Required]
    public int OrderId { get; set; }
    [Required]
    public int Quantity { get; set; }

    public virtual SystemOrder Order { get; set; } = null!;

    public virtual Stock Stock { get; set; } = null!;
}
