using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Employee
{
    [Key]
    public int EmployeeId { get; set; }

    public int UserId { get; set; }

    public int? JobTitleId { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string CellphoneNumber { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Address { get; set; }

    public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();

    public virtual JobTitle? JobTitle { get; set; }

    public virtual ICollection<SystemOrder> SystemOrders { get; set; } = new List<SystemOrder>();

    public virtual SystemUser User { get; set; } = null!;
}
