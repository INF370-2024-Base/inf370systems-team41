using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderStatus
{
    [Key]
    public int OrderStatusId { get; set; }

    public string OrderStatusState { get; set; } = null!;

    public string Description { get; set; } = null!;

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
