using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Discount
{
    [Key]
    public int DiscountId { get; set; }
    [Required]

    public int SystemOrderId { get; set; }
    [Required]

    public string ReasonForDiscount { get; set; }
    [Required]

    public decimal DiscountAmount { get; set; }
    [Required]

    public DateTime DiscountDate { get; set; }

    public virtual SystemOrder SystemOrder { get; set; } = null!;
}
