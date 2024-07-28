using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class StockWriteOff
{
    [Key]
    public int StockWriteOffId { get; set; }

    public int StockId { get; set; }
    [Required]

    public decimal QuantityWrittenOff { get; set; }
    [Required]

    public DateTime WriteOffDate { get; set; }=DateTime.Now;

    public string Reason { get; set; }

    public virtual Stock Stock { get; set; } = null!;
}
