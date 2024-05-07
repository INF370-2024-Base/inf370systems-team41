using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Dentist
{
    [Key]
    public int DentistId { get; set; }

    public string LastName { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string ContactDetail { get; set; } = null!;

    public string? Address { get; set; }

    public virtual ICollection<Patient>?  Patients { get; set; } = new List<Patient>();

    public virtual ICollection<SystemOrder>? SystemOrders { get; set; } = new List<SystemOrder>();
}
