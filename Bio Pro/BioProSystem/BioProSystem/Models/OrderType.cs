using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderType
{
    [Key]
    public int OrderTypeId { get; set; }
    [Required]
    public string Description { get; set; } = null!;

    public virtual ICollection<SystemOrder> systemOrders { get; set; } = new List<SystemOrder>();
}
