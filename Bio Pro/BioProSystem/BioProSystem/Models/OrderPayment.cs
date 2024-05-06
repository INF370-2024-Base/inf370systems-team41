using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderPayment
{
    [Key]
    public int OrderId { get; set; }

    public int PaymentId { get; set; }

    public string OrderPaymentStatus { get; set; } = null!;

    public virtual SystemOrder Order { get; set; } = null!;

    public virtual Payment Payment { get; set; } = null!;
}
