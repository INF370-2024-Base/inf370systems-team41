using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Delivery
{
    [Key]
    public int DeliveryId { get; set; }

    public int OrderId { get; set; }

    public int EmployeeId { get; set; }

    public DateTime DeliveryDate { get; set; }

    public int? DeliveryStatusId { get; set; }

    public virtual DeliveryStatus? DeliveryStatus { get; set; }

    public virtual Employee Employee { get; set; } = null!;

    public virtual SystemOrder Order { get; set; } = null!;
}
