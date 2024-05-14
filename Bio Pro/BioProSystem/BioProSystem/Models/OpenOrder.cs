using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OpenOrder
{
    [Key]
    public int OpenOrderId { get; set; }
    [Required]

    public string? Description { get; set; }
    
    [Required]

    public virtual SystemOrder systemOrder { get; set; } = null!;
}
