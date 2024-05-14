using BioProSystem.Models;

namespace BioProSystem.Models
{
    public interface IRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
        Task<OpenOrder[]> GetAllOpenOrdersAsync();
        Task<OpenOrder> GetOpenOrdersAsync(int custId);
        Task<SystemUser> GetsystemUserAsync(string systemUserEmail);
        //Employee
        Task<JobTitle> GetJobTitleByIdAsync(int id);
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
        Task<Employee> GetEmployeeByIdAsync(int id);
        Task<Employee> UpdateEmployeeAsync(Employee employee);
        Task<bool> DeleteEmployeeAsync(Employee employee);

        Task<Employee> AddEmployeeWithSystemUserAsync(Employee employee, string systemUserEmail);
        //Dentist 
        Task<Dentist[]> GetAllDentistsAsync();
        Task<Dentist> GetDentistAsync(int dentistId);
        void AddDentist(Dentist dentist);
        void UpdateDentist(Dentist dentist);
        void DeleteDentist(Dentist dentist);

        // New methods for EmployeeDailyHours
        Task<EmployeeDailyHours> AddEmployeeDailyHoursAsync(EmployeeDailyHours employeeDailyHours);
        Task<IEnumerable<EmployeeDailyHours>> GetAllEmployeeDailyHoursAsync();
        Task<EmployeeDailyHours> GetEmployeeDailyHoursAsync(int id);
        Task<bool> UpdateEmployeeDailyHoursAsync(EmployeeDailyHours employeeDailyHours);
        Task<bool> DeleteEmployeeDailyHoursAsync(EmployeeDailyHours employeeDailyHours);
    }
}
