using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Payment
{
    [Key]
    public int PaymentId { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public DateTime PaymentDate { get; set; }

    public byte[] ProofOfPayment { get; set; } = null!;

    public virtual ICollection<LatePayment> LatePayments { get; set; } = new List<LatePayment>();

    public virtual ICollection<RefundPayment> RefundPayments { get; set; } = new List<RefundPayment>();
}
