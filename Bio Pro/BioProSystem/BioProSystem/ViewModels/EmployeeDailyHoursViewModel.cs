namespace BioProSystem.ViewModels
{
    public class EmployeeDailyHoursViewModel
    {
        
        public int EmployeeDailyHoursId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime WorkDate { get; set; }
        public decimal Hours { get; set; }
    }
}
