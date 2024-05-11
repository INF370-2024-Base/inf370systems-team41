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
    }
}
