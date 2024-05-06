using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class SystemUser:IdentityUser
{
    public string name { get; set; }
    public string surname { get; set; }
    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual ICollection<Login> Logins { get; set; } = new List<Login>();
    public virtual ICollection<PasswordManagement> Management { get; set; } = new List<PasswordManagement>();
    public virtual ICollection<UserAction> UserActions { get; set; } = new List<UserAction>();
}
