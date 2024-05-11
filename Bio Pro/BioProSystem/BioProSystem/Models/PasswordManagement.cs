using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class PasswordManagement
{
    [Key]
    public int ManagementId { get; set; }
    [Required]

    public DateTime ChangeTimeStamp { get; set; }

    public int ActionTypeId { get; set; }

    public virtual ActionType ActionType { get; set; } = null!;

    public virtual ICollection<SystemUser> User { get; set; } = new List<SystemUser>();
}
