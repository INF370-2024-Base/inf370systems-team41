using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Login
{
    [Key]
    public int LoginId { get; set; }

    public int? UserId { get; set; }

    public DateTime LoginTimeStamp { get; set; }

    public string? LoginAttempt { get; set; }

    public virtual SystemUser? User { get; set; }
}
