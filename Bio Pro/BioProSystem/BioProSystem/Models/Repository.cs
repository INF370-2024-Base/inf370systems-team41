using BioProSystem.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        public async Task<TeethShade> GetTeethShadeAsync(int teethshadeIds)
        {

            IQueryable<TeethShade> query = _appDbContext.TeethShades.Where(c => c.TeethShadeId == teethshadeIds);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<List<TeethShade>> GetTeethShadesAsync(List<int> teethshadeIds)
        {
            List<TeethShade> teethshadeIdsList = new List<TeethShade>();
            foreach (int teethshadeid in teethshadeIds)
            {
                // Replace with actual asynchronous method for retrieving a single TeethShade
                Task<TeethShade> teethShadeTask = GetTeethShadeAsync(teethshadeid); // Example (replace with your implementation)
                TeethShade teethShade = await teethShadeTask; // Use await here for asynchronous retrieval
                teethshadeIdsList.Add(teethShade);
            }
            return teethshadeIdsList;
        }
        public async Task<SelectedArea> GetSelectedAreaAsync(int areaId)
        {

            IQueryable<SelectedArea> query = _appDbContext.SelectedAreas.Where(c => c.SelectedAreaId == areaId);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<List<SelectedArea>> GetSelectedAreasAsync(List<int> areaIds)
        {
            List<SelectedArea> areaIdsList = new List<SelectedArea>();
            foreach (int areaId in areaIds)
            {
                // Replace with actual asynchronous method for retrieving a single TeethShade
                Task<SelectedArea> selectAreaTask = GetSelectedAreaAsync(areaId); // Example (replace with your implementation)
                SelectedArea slecetedArea = await selectAreaTask; // Use await here for asynchronous retrieval
                areaIdsList.Add(slecetedArea);
            }
            return areaIdsList;
        }
        public async Task<SystemUser> GetsystemUserAsync(string systemUserEmail)
        {
            IQueryable<SystemUser> query = _appDbContext.SystemUsers.Where(c => c.Email == systemUserEmail);
            
            return await query.FirstOrDefaultAsync();
        }
        public async Task<bool> CheckSystemPatient(string medicalAidNumber)
        {
            IQueryable<Patient> query = _appDbContext.Patients.Where(p => p.MedicalAidNumber == medicalAidNumber);
            bool result = await query.AnyAsync();
            return result;
        }

        public async Task<Patient> GetPatientByMedicalAidNumber(string medicalAidNumber)
        {
            IQueryable<Patient> query = _appDbContext.Patients.Where(p=>p.MedicalAidNumber== medicalAidNumber);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<MedicalAid> GetMedicalAidByMedicalAidId(int medicalAidId)
        {
            IQueryable<MedicalAid> query = _appDbContext.MedicalAids.Where(p => p.MedicalAidId == medicalAidId);
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

        public async Task<List<OrderType>> GetOrderTypesAsync()
        {
            return await _appDbContext.OrderTypes.ToListAsync();
        }

        public async Task<List<OrderStatus>> GetOrderStatusesAsync()
        {
            return await _appDbContext.OrderStatuses.ToListAsync();
        }
    }
}
