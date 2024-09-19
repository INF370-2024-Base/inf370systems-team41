using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class StockItem
{
    [Key]
    public int StockItemId { get; set; }
    public int StockId { get; set; }

    public string OrderId { get; set; }
    [Required]
    public decimal Quantity { get; set; }

    public DateTime DateUsed { get; set; }
    public virtual SystemOrder Order { get; set; } = null!;
    
    public virtual Stock Stock { get; set; } = null!;
}
