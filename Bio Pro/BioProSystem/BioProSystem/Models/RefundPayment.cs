using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class RefundPayment
{
    [Key]
    public int RefundPaymentId { get; set; }

    public int PaymentId { get; set; }

    public byte[] ProofOfrefund { get; set; } = null!;

    public DateTime RefundPaymentDate { get; set; }

    public string ReasonForRefund { get; set; } = null!;

    public decimal RefundPaymentAmount { get; set; }

    public virtual Payment Payment { get; set; } = null!;
}
