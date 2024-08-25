using System.ComponentModel.DataAnnotations;
using System;
using System.Collections.Generic;

namespace BioProSystem.Models
{
    public partial class AuditTrail
    {
        [Key]
        public int AuditTrailId { get; set; }
        [Required]
        public DateTime DateOfTransaction { get; set; }
        [Required]
        public string SystemUserId { get; set; } = null!;
        public string TransactionType { get; set; }
        public string AdditionalData { get; set; }

        public virtual SystemUser SystemUser { get; set; } = null!;
    }
}
