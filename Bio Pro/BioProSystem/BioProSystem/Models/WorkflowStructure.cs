using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class WorkflowStructure
{
    [Key]
    public int WorkflowStructureId { get; set; }

    public string PriorityLevel { get; set; } = null!;

    public string WorkflowStructureProcedure { get; set; } = null!;

    public int WorkflowStatusId { get; set; }

    public virtual WorkflowStatus WorkflowStatus { get; set; } = null!;
}
