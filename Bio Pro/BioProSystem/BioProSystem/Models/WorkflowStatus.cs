using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class WorkflowStatus
{
    [Key]
    public int WorkflowStatusId { get; set; }

    public string WorkflowStatusStatus { get; set; } = null!;

    public virtual ICollection<WorkflowStructure> WorkflowStructures { get; set; } = new List<WorkflowStructure>();
}
