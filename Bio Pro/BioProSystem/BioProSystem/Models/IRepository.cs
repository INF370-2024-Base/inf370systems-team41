using BioProSystem.Models;
using BioProSystem.ViewModels;

namespace BioProSystem.Models
{
    public interface IRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveChangesAsync();
        Task<OpenOrder[]> GetAllOpenOrdersAsync();
        Task<OpenOrder> GetOpenOrdersAsync(int custId);
        Task<List<SystemOrder>> GetOrdersAwaitingDentalDesign();
        Task<List<Employee>> GetEmployeesWithJobTitleId(int jobTitileId);
        Task<SystemUser> GetsystemUserAsync(string systemUserEmail);
        Task<List<SystemUser>> GetAllSystemUserActiveAsync();
        Task<IEnumerable<Dentist>> GetDentistsAsync(); // Method to fetch all dentists
        Task<IEnumerable<MedicalAid>> GetMedicalAidsAsync(); // Method to fetch all medical aids
        Task<IEnumerable<OrderDirection>> GetOrderDirectionsAsync();
        Task<IEnumerable<TeethShade>> GetAllTeethShadesAsync(); // Method to fetch all teeth shades
        Task<IEnumerable<SystemOrder>> GetAllSystemOrdersAsync();
        Task<IEnumerable<SelectedArea>> GetSelectedAreasAsync();
        Task<SystemOrder> GetSystemOrderByIdAsync(string orderId);
        Task<bool> CheckSystemPatient(string medicalAidNumber);
        Task<Patient> GetPatientByMedicalAidNumber(string medicalAidNumber);
        Task<MedicalAid> GetMedicalAidByMedicalAidId(int medicalAidId);
        Task<TeethShade> GetTeethShadeAsync(int teethshadeIds);
        Task<List<TeethShade>> GetTeethShadesAsync(List<int> teethshadeIds);
        Task<SelectedArea> GetSelectedAreaAsync(int areaId);
        Task<List<SelectedArea>> GetSelectedAreasAsync(List<int> areaIds);
        Task<List<OrderType>> GetOrderTypesAsync();
        Task<OrderDirection> GetOrderDirectionById(int orderDirectionId);
        Task<List<OrderStatus>> GetOrderStatusesAsync();
        Task<OrderWorkflowTimeline> GetOrderTimelineByIdAsync(int orderTimelinId);
        Task<OrderStatus> GetOrderStatusByIdAsync(int orderStatusId);
        Task<OrderType> GetOrderTypeByIdAsync(int ordertypeId);

        Task<MedicalAid> GetMedicalAidByIdAsync(int medicalAidId);

        Task<Dentist> GetDentistdByIdAsync(int dentistId);
        Task<SystemOrderViewModel> GetAllSystemOrdersInformationAsync(string orderId);
        Task<List<SystemOrder>> GetSystemOrdersWithOrderStatusID(int orderStatusId);
        Task<List<Employee>> AssignAvailableTechnicians(int orderDirectionId, string systemOrderId);
        Task<OrderWorkflowTimeline> GetOrdertimeFlowBySystemOrderId(string systemOrderId);
        //Employee
        Task<List<JobTitle>> GetJobTitlesAsync();
        Task<Employee[]> GetAllEmployeeAsync();
        Task<JobTitle> GetJobTitleByIdAsync(int id);
        Task<IEnumerable<Employee>> GetAllEmployeesAsync();
        Task<Employee> GetEmployeeByIdAsync(int id);
        Task<Employee> UpdateEmployeeAsync(Employee employee);
        Task<bool> DeleteEmployeeAsync(Employee employee);
        Task<Employee> GetEmployeeByEmailAsync(string email);
        Task<Employee> AddEmployeeWithSystemUserAsync(Employee employee, string systemUserEmail);
        //Dentist 
        Task<Dentist[]> GetAllDentistsAsync();
        Task<Dentist> GetDentistAsync(int dentistId);
        void AddDentist(Dentist dentist);
        void UpdateDentist(Dentist dentist);
        void DeleteDentist(Dentist dentist);
        Task<MediaFile> GetImageDataFromId(int imageID);
        // New methods for EmployeeDailyHours
        Task CaptureEmployeeDailyHoursAsync(int employeeId, EmployeeDailyHours newDailyHours);
        //Jacques
        Task<List<SystemOrder>> GetOrdersInProgressAndNoTimeline();
        Task<SystemOrder> GetSystemOrderByWorkflowId(int workflowtimelineId);
        Task<List<SystemOrder>> GetFinishedSystemWithoutDeliveriesOrders();
        Task<List<Delivery>> GetDeliveries();

        Task<EmployeeDailyHours> GetEmployeeDailyHoursById(int employeedDailyHoursId);
        Task<List<EmployeeDailyHours>> GetEmployeeDailyHours();
        Task<MediaFile> GetMediaFileById(int mediaFileId);
        //stock
        Task<List<Stock>> GetAllStocks();
        Task<List<StockType>> GetAllStockTypes();
        Task<List<StockCategory>> GetAllStockCategories();
        Task<StockCategory> GetStockCategoryById(int stockCategoryId);
        Task<Stock> GetStockById(int stockId);
        Task<StockType> GetStockTypeById(int stockTypeId);

        //Report
        Task<List<StockType>> GetStockTypesCountByCategory();
        Task<List<StockCategory>> GetStockItemsCountByCategory();
        Task<List<Employee>> GetEmployeeWeeklyHours();

    }
}
