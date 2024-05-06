using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderType
{
    [Key]
    public int OrderTypeId { get; set; }

    public string OrderTypeState { get; set; } = null!;

    public string Description { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
