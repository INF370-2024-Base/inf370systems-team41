using Microsoft.EntityFrameworkCore.Query.SqlExpressions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class SystemOrder
{
    [Key]
    public string OrderId { get; set; }
    public int DentistId { get; set; }
    public int OpenOrderId { get; set; }
    public int OrderStatusId { get; set; }
    public int? OrderWorkflowTimelineId { get; set; }
    public int OrderTypeId { get; set; }
    [Required]
    public DateTime DueDate { get; set; }
    [Required]
    public DateTime OrderDate { get; set; }
    public string? SpecialRequirements { get; set; }
    [Required]
    public string PriorityLevel { get; set; }
    [Required]
    public string MouthArea { get; set; }
    [Required]
    public decimal TotalAmountDue { get; set; }
    public string? EmergencyNumber { get; set; }

    public virtual ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
    public virtual ICollection<SelectedArea> SelectedAreas { get; set; } = new List<SelectedArea>();

    public virtual Dentist Dentist { get; set; } = null!;

    public virtual ICollection<Discount> Discounts { get; set; } = new List<Discount>();

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();
    public virtual ICollection<OrderPayment> OrderPayments { get; set; } = new List<OrderPayment>();
    public virtual ICollection<TeethShade> TeethShades { get; set; } = new List<TeethShade>();
    public virtual ICollection<StockItem> StockItems { get; set; } = new List<StockItem>();
    public virtual ICollection<DecisionLog> DecisionLogs { get; set; } = new List<DecisionLog>();
    public virtual ICollection<MediaFile> MediaFiles { get; set; } = new List<MediaFile>();
    public virtual OpenOrder OpenOrder { get; set; } = null!;
    public virtual OrderStatus OrderStatus { get; set; } = null!;
    public virtual OrderType OrderType { get; set; } = null!;
    public virtual OrderWorkflowTimeline? OrderWorkflowTimeline { get; set; } = null!;

}
