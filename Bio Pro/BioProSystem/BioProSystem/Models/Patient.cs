using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Patient
{
    [Key]
    public int PatientId { get; set; }
    [Required]
    public string FirstName { get; set; } = null!;
    [Required]
    public string Lastname { get; set; } = null!;
    public int DentistId { get; set; }
    public int MedicalAidId { get; set; }
    public string MedicalAidNumber { get; set; } = null!;
    public virtual Dentist? Dentist { get; set; } = null!;
    public virtual MedicalAid? MedicalAid { get; set; } = null!;
}
