﻿using BioProSystem.Migrations;

namespace BioProSystem.ViewModels
{
    public class UserInfoWithRolesViewModel
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public bool EmailConfirmed { get; set; }
        public string PhoneNumber { get; set; }
        public bool PhoneNumberConfirmed { get; set; }
        public bool TwoFactorEnabled { get; set; }
        public bool LockoutEnabled { get; set; }
        public DateTimeOffset? LockoutEnd { get; set; }
        public int AccessFailedCount { get; set; }
        public string ConcurrencyStamp { get; set; }
        public string SecurityStamp { get; set; }
        public string PasswordHash { get; set; }
        public string NormalizedEmail { get; set; }
        public string NormalizedUserName { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public bool IsActiveUser { get; set; }

        public List<BioProSystem.Models.AuditTrail> AuditTrails { get; set; }
        public List<EmployeeViewModel> Employees { get; set; }

        public List<string> Roles { get; set; }

    }
}