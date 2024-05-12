using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Stock
{
    [Key]
    public int StockId { get; set; }
    [Required]
    public int StockCategoryId { get; set; }
    [Required]
    public int SupplierId { get; set; }
    [Required]
    public string StockName { get; set; } = null!;
    [Required]
    public int QuantityAvailable { get; set; }
    [Required]
    public int MaximumStockLevel { get; set; }
    [Required]
    public int MinimumStockLevel { get; set; }

    public string? ReorderPoint { get; set; }

    public virtual ICollection<StakeWriteOff> StakeWriteOffs { get; set; } = new List<StakeWriteOff>();
    public virtual ICollection<StockItem> StockItem { get; set; } = new List<StockItem>();

    public virtual StockCategory StockCategory { get; set; } = null!;

    public virtual Supplier Supplier { get; set; } = null!;
}
