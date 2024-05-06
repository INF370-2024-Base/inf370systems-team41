using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class StakeWriteOff
{
    [Key]
    public int StakeWriteOffId { get; set; }

    public int StockId { get; set; }

    public int QuantityWrittenOff { get; set; }

    public DateTime WriteOffDate { get; set; }

    public virtual Stock Stock { get; set; } = null!;
}
