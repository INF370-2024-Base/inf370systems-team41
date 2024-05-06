using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class MediaFile
{
    [Key]
    public int MediaFileId { get; set; }

    public string FileName { get; set; } = null!;

    public byte[] FileSelf { get; set; } = null!;

    public decimal FileSizeKb { get; set; }

    public DateTime ExportDate { get; set; }

    public string? ExportStatus { get; set; }

    public virtual ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}
