using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Supplier
{
    [Key]
    public int SupplierId { get; set; }
    [Required]

    public string SupplierName { get; set; } = null!;

    public string CellphoneNumber { get; set; } = null!;

    public string Address { get; set; } = null!;

    public virtual ICollection<Stock> Stocks { get; set; } = new List<Stock>();
}
