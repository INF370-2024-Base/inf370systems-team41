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
    public decimal QuantityAvailable { get; set; }
    [Required]
    public int MaximumStockLevel { get; set; }
    [Required]
    public int MinimumStockLevel { get; set; }

    public int? ReorderPoint { get; set; }
    
    public bool CurrentlyInUse { get; set; } = true;

    public string Measurement { get; set; }
    public virtual ICollection<StockWriteOff> StockWriteOffs { get; set; } = new List<StockWriteOff>();
    public virtual ICollection<StockItem> StockItem { get; set; } = new List<StockItem>();

    public virtual StockCategory StockCategory { get; set; } = null!;

    public virtual Supplier Supplier { get; set; } = null!;
}
