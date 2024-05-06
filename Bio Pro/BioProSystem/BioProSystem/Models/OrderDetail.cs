using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models;

public partial class OrderDetail
{
    [Key]
    public int OrderDetailId { get; set; }

    public int? MediaFileId { get; set; }

    public int? OrderStatusId { get; set; }

    public int? DecisionLogId { get; set; }

    public int? OpenOrderId { get; set; }

    public int? OrderDirectionId { get; set; }

    public int? TeethShadeId { get; set; }

    public int? OrderTypeId { get; set; }

    public virtual DecisionLog? DecisionLog { get; set; }

    public virtual MediaFile? MediaFile { get; set; }

    public virtual OpenOrder? OpenOrder { get; set; }

    public virtual OrderDirection? OrderDirection { get; set; }

    public virtual OrderStatus? OrderStatus { get; set; }

    public virtual OrderType? OrderType { get; set; }

    public virtual ICollection<SystemOrder> SystemOrders { get; set; } = new List<SystemOrder>();

    public virtual TeethShade? TeethShade { get; set; }
}
