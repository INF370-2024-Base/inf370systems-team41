using BioProSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace BioProSystem.Models
{
    public class Repository :IRepository
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
            IQueryable<OpenOrder> query = _appDbContext.OpenOrders.Include(o=>o.systemOrder).ThenInclude(emp=>emp.Employees).Include(o=>o.systemOrder.Dentist);
            return await query.ToArrayAsync();
        }
        public async Task<OpenOrder> GetOpenOrdersAsync(int openOrderID)
        {
            IQueryable<OpenOrder> query = _appDbContext.OpenOrders.Where(c => c.OpenOrderId == openOrderID);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<SystemUser> GetsystemUserAsync(string systemUserEmail)
        {
            IQueryable<SystemUser> query = _appDbContext.SystemUsers.Where(c => c.Email == systemUserEmail);
            
            return await query.FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<TeethShade>> GetAllTeethShadesAsync()
        {
            return await _appDbContext.TeethShades.ToListAsync();
        }

        public async Task<IEnumerable<SystemOrder>> GetAllSystemOrdersAsync()
        {
            return await _appDbContext.SystemOrders.ToListAsync();
        }
        public async Task<IEnumerable<Dentist>> GetDentistsAsync()
        {
            return await _appDbContext.Dentists.ToListAsync();
        }

        public async Task<IEnumerable<MedicalAid>> GetMedicalAidsAsync()
        {
            return await _appDbContext.MedicalAids.ToListAsync();
        }

        public async Task<IEnumerable<OrderDirection>> GetOrderDirectionsAsync()
        {
            return await _appDbContext.OrderDirections.ToListAsync();
        }

        public async Task<SystemOrder> GetSystemOrderByIdAsync(string orderId)
        {
            return await _appDbContext.SystemOrders.FirstOrDefaultAsync(o => o.OrderId == orderId);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }
    }
}
