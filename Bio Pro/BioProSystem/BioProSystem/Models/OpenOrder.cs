using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OpenOrder
{
    [Key]
    public int OpenOrderId { get; set; }

    public string? Description { get; set; }

    public DateTime OpenOrderTimeStamp { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
