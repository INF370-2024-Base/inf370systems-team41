using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class SystemUser:IdentityUser
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Surname { get; set; }
    public bool isActiveUser { get; set; } = true;
    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public virtual ICollection<PasswordManagement> Management { get; set; } = new List<PasswordManagement>();
    public virtual ICollection<UserAction> UserActions { get; set; } = new List<UserAction>();
    public virtual ICollection<AuditTrail> AuditTrails { get; set; } = new List<AuditTrail>();
}
