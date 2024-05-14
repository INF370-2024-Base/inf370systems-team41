using BioProSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace BioProSystem.Models
{
    public class Repository : IRepository
    {
        private readonly DentalProSystemTestDBContext _appDbContext;

        public Repository(DentalProSystemTestDBContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public void Add<T>(T entity) where T : class
        {
            _appDbContext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _appDbContext.Remove(entity);
        }
        public async Task<SystemUser> GetsystemUserAsync(string systemUserEmail)
        {
         IQueryable<SystemUser> query = _appDbContext.SystemUsers.Where(u=>u.Email== systemUserEmail);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<OpenOrder[]> GetAllOpenOrdersAsync()
        {
            IQueryable<OpenOrder> query = _appDbContext.OpenOrders;
            return await query.ToArrayAsync();
        }
        public async Task<OpenOrder> GetOpenOrdersAsync(int openOrderID)
        {
            IQueryable<OpenOrder> query = _appDbContext.OpenOrders.Where(c => c.OpenOrderId == openOrderID);
            return await query.FirstOrDefaultAsync();
        }


        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        //Employee
        public async Task<JobTitle> GetJobTitleByIdAsync(int id)
        {
            return await _appDbContext.JobTitles.FindAsync(id);
        }
        public async Task<Employee> GetEmployeeByIdAsync(int id)
        {
            return await _appDbContext.Employees.FindAsync(id);
        }

        public async Task<IEnumerable<Employee>> GetAllEmployeesAsync()
        {
            return await _appDbContext.Employees.ToListAsync();
        }

        public async Task<Employee> UpdateEmployeeAsync(Employee employee)
        {
            _appDbContext.Entry(employee).State = EntityState.Modified;
            await _appDbContext.SaveChangesAsync();
            return employee;
        }

        public async Task<bool> DeleteEmployeeAsync(Employee employee)
        {
            _appDbContext.Employees.Remove(employee);
            return await _appDbContext.SaveChangesAsync() > 0;
        }
        public async Task<Employee> AddEmployeeWithSystemUserAsync(Employee employee, string systemUserEmail)
        {
            // Find the SystemUser by email
            var systemUser = await _appDbContext.SystemUsers.SingleOrDefaultAsync(u => u.Email == systemUserEmail);
            Console.WriteLine(systemUserEmail);

            if (systemUser == null)
            {
                throw new Exception("SystemUser not found for the provided email.");
            }

            // Link the SystemUser to the Employee by setting SystemUserId
            employee.SystemUserId = systemUser.Id;

            // Add the new employee to the repository
            _appDbContext.Employees.Add(employee);
            await _appDbContext.SaveChangesAsync(); // Save the new Employee

            return employee;
        }

        //End of Employee
        //Dentist
        public async Task<Dentist[]> GetAllDentistsAsync()
        {
            IQueryable<Dentist> query = _appDbContext.Dentists;
            return await query.ToArrayAsync();
        }

        public async Task<Dentist> GetDentistAsync(int dentistId)
        {
            IQueryable<Dentist> query = _appDbContext.Dentists.Where(d => d.DentistId == dentistId);
            return await query.FirstOrDefaultAsync();
        }

        public void AddDentist(Dentist dentist)
        {
            _appDbContext.Dentists.Add(dentist);
        }

        public void UpdateDentist(Dentist dentist)
        {
            _appDbContext.Entry(dentist).State = EntityState.Modified;
        }

        public void DeleteDentist(Dentist dentist)
        {
            _appDbContext.Dentists.Remove(dentist);
        }
        //End of Dentist 

        // Implementation for EmployeeDailyHours
        public async Task<EmployeeDailyHours> AddEmployeeDailyHoursAsync(EmployeeDailyHours employeeDailyHours)
        {
            _appDbContext.EmployeeDailyHours.Add(employeeDailyHours);
            await _appDbContext.SaveChangesAsync();
            return employeeDailyHours;
        }

        public async Task<IEnumerable<EmployeeDailyHours>> GetAllEmployeeDailyHoursAsync()
        {
            return await _appDbContext.EmployeeDailyHours.ToListAsync();
        }

        public async Task<EmployeeDailyHours> GetEmployeeDailyHoursAsync(int id)
        {
            return await _appDbContext.EmployeeDailyHours.FindAsync(id);
        }

        public async Task<bool> UpdateEmployeeDailyHoursAsync(EmployeeDailyHours employeeDailyHours)
        {
            _appDbContext.Entry(employeeDailyHours).State = EntityState.Modified;
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteEmployeeDailyHoursAsync(EmployeeDailyHours employeeDailyHours)
        {
            _appDbContext.EmployeeDailyHours.Remove(employeeDailyHours);
            return await _appDbContext.SaveChangesAsync() > 0;
        }
    }
}
