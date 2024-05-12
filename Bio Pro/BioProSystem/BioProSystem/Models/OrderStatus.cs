using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderStatus
{
    [Key]
    public int OrderStatusId { get; set; }

    [Required]

    public string Description { get; set; }

    public virtual ICollection<SystemOrder> OrderDetails { get; set; } = new List<SystemOrder>();
}
