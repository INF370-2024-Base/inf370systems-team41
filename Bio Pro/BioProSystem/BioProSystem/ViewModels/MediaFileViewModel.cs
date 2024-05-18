using System.ComponentModel.DataAnnotations;

namespace BioProSystem.ViewModels
{
    public class MediaFileViewModel
    {
        public string SystemOrderId { get; set; }
        public string FileName { get; set; } = null!;
        [Required]

        public string FileSelf { get; set; } = null!;

        public decimal? FileSizeKb { get; set; } = null!;
    }
}
