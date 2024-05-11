using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Employee
{
    [Key]
    public int EmployeeId { get; set; }

    public int SystemUserId { get; set; }

    public int? JobTitleId { get; set; }
    [Required]

    public string FirstName { get; set; }
    [Required]

    public string LastName { get; set; }

    public string CellphoneNumber { get; set; } = null!;
    [Required]
    public string Email { get; set; }

    public string? Address { get; set; }

    public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();

    public virtual JobTitle? JobTitle { get; set; } = null!;

    public virtual ICollection<SystemOrder> SystemOrders { get; set; } = new List<SystemOrder>();
    public virtual ICollection<EmployeeDailyHours> EmployeeDailyHours { get; set; } = new List<EmployeeDailyHours>();

    public virtual SystemUser SystemUser { get; set; } = null!;
}
