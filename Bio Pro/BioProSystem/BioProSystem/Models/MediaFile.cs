using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class MediaFile
{
    [Key]
    public int MediaFileId { get; set; }
    [Required]
    public int SystemOrderId { get; set; }
    public string FileName { get; set; } = null!;
    [Required]

    public byte[] FileSelf { get; set; } = null!;

    public decimal? FileSizeKb { get; set; } = null!;

    public DateTime? ExportDate { get; set; } = null!;

    public string? ExportStatus { get; set; } = null!;

    public virtual SystemOrder SystemOrder { get; set; } = null!;
}
