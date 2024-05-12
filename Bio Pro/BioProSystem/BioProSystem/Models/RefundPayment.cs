using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class RefundPayment
{
    [Key]
    public int RefundPaymentId { get; set; }
    [Required]
    public int PaymentId { get; set; }
    [Required]
    public byte[] ProofOfrefund { get; set; } = null!;
    [Required]
    public DateTime RefundPaymentDate { get; set; }
    [Required]
    public string ReasonForRefund { get; set; } = null!;
    [Required]
    public decimal RefundPaymentAmount { get; set; }

    public virtual Payment Payment { get; set; } = null!;
}
