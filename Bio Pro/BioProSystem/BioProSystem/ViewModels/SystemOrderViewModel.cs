using BioProSystem.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace BioProSystem.ViewModels
{
    public class SystemOrderViewModel
    {
        

        //[Required(ErrorMessage = "Please enter valid Order ID.")]
        public string OrderId { get; set; }

        //[Required(ErrorMessage = "Please enter a valid date.")]
        [DataType(DataType.Date)]
        public DateTime OrderDate { get; set; }

        //[Required(ErrorMessage = "Please enter the patient's name.")]
        public string PatientName { get; set; }

        //[Required(ErrorMessage = "Please enter the patient's surname.")]
        public string PatientSurname { get; set; }
//
        //[Required(ErrorMessage = "Please select a medical aid.")]
        public int MedicalAidId { get; set; }

        //[Required(ErrorMessage = "Please enter the medical aid number.")]
        public string MedicalAidNumber { get; set; }

        //[Required(ErrorMessage = "Please select an order direction.")]
        public int OrderDirectionId { get; set; }
        public string MouthArea { get; set; }

        //[Required(ErrorMessage = "Please enter the estimated duration in days.")]
        public int EstimatedDurationInDays { get; set; }

        //[Required]
        public string? EmergencyNumber { get; set; }//Nullable to account for possibility of number not provided

        public DateTime DueDate { get; set; }
        //[Required]
      
        public string? SpecialRequirements { get; set; }
        //[Required]

        public string PriorityLevel { get; set; }
        public List<int> TeethShadesIds { get; set; }
        public List<int> SeletedAreasIds { get; set; }

        public int DentistId { get; set; }
        public int OrderTypeId { get; set; }
        public int? OpenOrderId { get; set; }
        public int OrderStatusId { get; set; }
        public int? OrderWorkflowTimelineId { get; set; }
    }
}
