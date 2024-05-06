using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class JobTitle
{
    [Key]
    public int JobTitleId { get; set; }

    public string? TitleName { get; set; }

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
}
