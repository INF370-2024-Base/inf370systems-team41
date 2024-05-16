using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class JobTitle
{
    [Key]
    public int JobTitleId { get; set; }
    [Required]
    public string TitleName { get; set; }

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual ICollection<OrderDirectionState> OrderDirectionstates { get; set; }
}
