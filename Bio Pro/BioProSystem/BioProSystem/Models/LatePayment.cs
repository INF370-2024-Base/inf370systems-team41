using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class LatePayment
{
    [Key]
    public int LatePaymentId { get; set; }

    public int PaymentId { get; set; }

    public DateTime LatePaymentDate { get; set; }

    public virtual Payment Payment { get; set; } = null!;
}
