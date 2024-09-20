using BioProSystem.Models;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.ViewModels
{
    public class EditMediaFileViewModel
    {

        public int MediaFileID { get; set; }
        public string FileName { get; set; } = null!;
        [Required]

        public string FileSelf { get; set; } = null!;

        public decimal? FileSizeKb { get; set; } = null!;
    }
}
