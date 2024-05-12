using System.ComponentModel.DataAnnotations;

namespace BioProSystem.Models
{
    public class EmployeeDailyHours
    {
        [Key]
        public int EmployeeDailyHoursId { get; set; }
        [Required]

        public DateTime WorkDate { get; set; }

        [Required]

        public decimal Hours { get; set; }

        public virtual ICollection<Employee>? Employees { get; set; } = new List<Employee>();
    }
}
