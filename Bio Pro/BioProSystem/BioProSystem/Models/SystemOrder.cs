using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class SystemOrder
{
    [Key]
    public int OrderId { get; set; }

    public int OrderDetailId { get; set; }

    public int DentistId { get; set; }

    public int EmployeeId { get; set; }

    public DateTime DueDate { get; set; }

    public DateTime OrderDate { get; set; }

    public decimal TotalAmountDue { get; set; }

    public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();

    public virtual Dentist Dentist { get; set; } = null!;

    public virtual ICollection<Discount> Discounts { get; set; } = new List<Discount>();

    public virtual Employee Employee { get; set; } = null!;

    public virtual OrderDetail OrderDetail { get; set; } = null!;
}
