using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class ActionType
{
    [Key]
    public int ActionTypeId { get; set; }

    public string Description { get; set; } = null!;

    public virtual ICollection<PasswordManagement> PasswordManagements { get; set; } = new List<PasswordManagement>();
}
