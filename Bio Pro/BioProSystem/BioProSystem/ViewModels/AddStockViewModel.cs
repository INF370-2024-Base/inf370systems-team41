using System.ComponentModel.DataAnnotations;

namespace BioProSystem.ViewModels
{
    public class AddStockViewModel
    {
        public int StockCategoryId { get; set; }
        public int SupplierId { get; set; }
        public string StockName { get; set; }
        public string Measurement
        {
            get; set;
        }
        public int QuantityAvailable { get; set; }
        public int MaximumStockLevel { get; set; }
        public int MinimumStockLevel { get; set; }

        public int? ReorderPoint { get; set; }

        public bool CurrentlyInUse { get; set; } = true;
    }
}
