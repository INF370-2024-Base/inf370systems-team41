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
        Task<IEnumerable<Dentist>> GetDentistsAsync(); // Method to fetch all dentists
        Task<IEnumerable<MedicalAid>> GetMedicalAidsAsync(); // Method to fetch all medical aids
        Task<IEnumerable<OrderDirection>> GetOrderDirectionsAsync();
        Task<IEnumerable<TeethShade>> GetAllTeethShadesAsync(); // Method to fetch all teeth shades
        Task<IEnumerable<SystemOrder>> GetAllSystemOrdersAsync();

        Task<SystemOrder> GetSystemOrderByIdAsync(string orderId);
        Task<bool> CheckSystemPatient(string medicalAidNumber);
        Task<Patient> GetPatientByMedicalAidNumber(string medicalAidNumber);
        Task<MedicalAid> GetMedicalAidByMedicalAidId(int medicalAidId);
        Task<TeethShade> GetTeethShadeAsync(int teethshadeIds);
        Task<List<TeethShade>> GetTeethShadesAsync(List<int> teethshadeIds);
        Task<SelectedArea> GetSelectedAreaAsync(int areaId);
        Task<List<SelectedArea>> GetSelectedAreasAsync(List<int> areaIds);

    }
}
