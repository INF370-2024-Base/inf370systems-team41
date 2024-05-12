using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
namespace BioProSystem.Models
{
    public partial class SelectedArea
    {
        [Key]
        public int SelectedAreaId { get; set; }
        public decimal X { get; set; }
        public decimal Y { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public virtual List<SystemOrder>? SystemOrders { get; set; } = null!;
    }
}

