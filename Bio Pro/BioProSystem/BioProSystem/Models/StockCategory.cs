using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class StockCategory
{
    [Key]
    public int StockCategoryId { get; set; }
    [Required]
    public string Description { get; set; } = null!;

    public virtual ICollection<Stock> Stocks { get; set; } = new List<Stock>();
}
