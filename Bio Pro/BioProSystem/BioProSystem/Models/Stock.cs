using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Stock
{
    [Key]
    public int StockId { get; set; }

    public int StockCategoryId { get; set; }

    public int SupplierId { get; set; }

    public string StockName { get; set; } = null!;

    public int QuantityAvailable { get; set; }

    public int MaximumStockLevel { get; set; }

    public int MinimumStockLevel { get; set; }

    public string? ReorderPoint { get; set; }

    public virtual ICollection<StakeWriteOff> StakeWriteOffs { get; set; } = new List<StakeWriteOff>();

    public virtual StockCategory StockCategory { get; set; } = null!;

    public virtual Supplier Supplier { get; set; } = null!;
}
