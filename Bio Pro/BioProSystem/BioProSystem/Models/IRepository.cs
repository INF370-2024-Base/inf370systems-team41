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

    }
}
