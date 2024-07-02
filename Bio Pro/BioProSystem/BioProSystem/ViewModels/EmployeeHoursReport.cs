using BioProSystem.Models;

namespace BioProSystem.ViewModels
{
    public class EmployeeHoursReport
    {
        public Employee Employee { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int Week {  get; set; }
        public decimal TotalHours { get; set; }
    }
}
