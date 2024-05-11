﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Delivery
{
    [Key]
    public int DeliveryId { get; set; }
    [Required]

    public int SystemOrderId { get; set; }
    [Required]

    public int EmployeeId { get; set; }
    [Required]

    public DateTime DeliveryDate { get; set; }
    [Required]

    public int DeliveryStatusId { get; set; }

    public virtual DeliveryStatus DeliveryStatus { get; set; } = null!;

    public virtual Employee Employee { get; set; } = null!;

    public virtual SystemOrder SystemOrder { get; set; } = null!;
}
