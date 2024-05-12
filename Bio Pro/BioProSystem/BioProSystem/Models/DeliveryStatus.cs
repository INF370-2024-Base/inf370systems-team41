using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class DeliveryStatus
{
    [Key]
    public int DeliveryStatusId { get; set; }
    [Required]

    public string Status { get; set; } = null!;

    public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
}
