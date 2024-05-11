using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Payment
{
    [Key]
    public int PaymentId { get; set; }
    public int RefundPaymentId { get; set; }
    [Required]
    public string PaymentMethod { get; set; } = null!;
    [Required]
    public DateTime PaymentDate { get; set; }
    [Required]
    public byte[] ProofOfPayment { get; set; } = null!;

    public bool IslatePayment { get; set; } = false;

    public virtual ICollection<OrderPayment> OrderPayment { get; set; } = new List<OrderPayment>();
    public virtual RefundPayment RefundPayments { get; set; } = null!; 
}
