using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class Patient
{
    [Key]
    public int PatientId { get; set; }

    public string FirsName { get; set; } = null!;

    public string Lastname { get; set; } = null!;

    public int DentistId { get; set; }

    public int MedicalAidId { get; set; }

    public string CellphoneNumber { get; set; } = null!;

    public virtual Dentist Dentist { get; set; } = null!;

    public virtual MedicalAid MedicalAid { get; set; } = null!;
}
