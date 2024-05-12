using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class MedicalAid
{
    [Key]
    public int MedicalAidId { get; set; }

    public string MedicalAidNumber { get; set; } = null!;

    public string MedicalAidName { get; set; } = null!;

    public virtual ICollection<Patient> Patients { get; set; } = new List<Patient>();
}
