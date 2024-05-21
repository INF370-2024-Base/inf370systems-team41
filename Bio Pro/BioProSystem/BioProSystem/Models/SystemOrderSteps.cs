using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace BioProSystem.Models
{
    public class SystemOrderSteps
    {
        [Key]
        public int SysteorderStepId { get; set; }

        public DateTime? DueDateForStep { get; set; }

        public DateTime? StartDateForStep { get; set; }

        public string Description { get; set; }

        public int EmployeeId { get; set; }
        public string  SystemOrderId { get; set; }
        public bool Completed { get; set; }=false;
        public bool IsCurrentStep { get; set; }=false ;
        public virtual SystemOrder SystemOrders { get; set; } = null;
        public virtual Employee Employee { get; set; } = null;


    }
}
