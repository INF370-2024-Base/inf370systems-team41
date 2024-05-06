using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Discount
{
    [Key]
    public int DiscountId { get; set; }

    public int OrderId { get; set; }

    public string ReasonForDiscount { get; set; } = null!;

    public decimal DiscountAmount { get; set; }

    public DateTime DiscountDate { get; set; }

    public virtual SystemOrder Order { get; set; } = null!;
}
