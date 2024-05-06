using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class UserAction
{
    [Key]
    public int ActionId { get; set; }

    public int UserId { get; set; }

    public string Description { get; set; } = null!;

    public virtual SystemUser User { get; set; } = null!;
}
