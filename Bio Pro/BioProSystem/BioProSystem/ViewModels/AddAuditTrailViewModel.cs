using BioProSystem.Models;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.ViewModels
{
    public class AddAuditTrailViewModel
    {

        public DateTime DateOfTransaction { get; set; }
        public string SystemUserId { get; set; } = null!;
        public string TransactionType { get; set; }
        public string AdditionalData { get; set; }
    }
}
