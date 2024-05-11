namespace BioProSystem.ViewModels
{
    public class EmployeeViewModel
    {
        public int UserId { get; set; }
        public int? JobTitleId { get; set; } // This will be 1 for Admin, 2 for Lab Manager, 3 for Technician
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CellphoneNumber { get; set; }
        public string Email { get; set; }
        public string? Address { get; set; }
    }

}