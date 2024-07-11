using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BioProSystem.Models;

public partial class Employee
{
    [Key]
    public int EmployeeId { get; set; }

    public string SystemUserId { get; set; }

    public int JobTitleId { get; set; }
    [Required]

    public string FirstName { get; set; }
    [Required]

    public string LastName { get; set; }

    public string CellphoneNumber { get; set; } = null!;
    [Required]
    public string Email { get; set; }

    public string? Address { get; set; }
    public bool isActiveEmployee { get; set; } = true;

    public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();

    public virtual JobTitle? JobTitle { get; set; } = null!;

    public virtual ICollection<SystemOrder> SystemOrders { get; set; } = new List<SystemOrder>();
    public virtual ICollection<EmployeeDailyHours> EmployeeDailyHours { get; set; } = new List<EmployeeDailyHours>();
    public virtual ICollection<SystemOrderSteps> SystemOrderSteps { get; set; } = new List<SystemOrderSteps>();
    public virtual SystemUser SystemUser { get; set; } = null!;

    //[NotMapped]
   // public List<(int Month, int Year, decimal TotalHours)> MonthlyHours { get; set; } = new List<(int Month, int Year, decimal TotalHours)>();
}