﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BioProSystem.Models
{
    public class StockType
    {
        [Key]
        public int StockTypeId { get; set; }

        public string Description { get; set; } = null!;

        public virtual ICollection<StockCategory> StockCategories { get; set; } = new List<StockCategory>();

        [NotMapped]
        public int StockCategoriesCount { get; set; }
    }
}
