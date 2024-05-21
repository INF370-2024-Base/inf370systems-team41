using BioProSystem.Models;
using BioProSystem.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
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
            IQueryable<OpenOrder> query = _appDbContext.OpenOrders;
            return await query.ToArrayAsync();
        }
        public List<Employee> AssignAvailableTechnicians(int orderDirectionId,string systemOrderId)
        {
            var availableEmployees = _appDbContext.Employees
                .Where(e => e.SystemOrders.Count(so => so.OrderStatusId == 2) < 3)
                .ToList();  

            var orderDirectionSteps = _appDbContext.OrderDirectionStates.Where(o => o.OrderDirectionsId == orderDirectionId).ToList(); 
            
           OrderWorkflowTimeline timeline = GetOrdertimeFlowBySystemOrderId(systemOrderId).Result;
            var assignedEmployees = new List<Employee>();
            var systemorder=GetSystemOrderByIdAsync(systemOrderId).Result;
            bool tooLate = false;

            int estimatedDays = GetOrderDirectionById(orderDirectionId).Result.EstimatedDurationInDays;
            if (systemorder.DueDate.AddDays(-1 * estimatedDays)<DateTime.Now)
            {
                tooLate = true;
            }
            foreach (var orderDirectionStep in orderDirectionSteps)
            {
                var employee = availableEmployees.Where(e => e.JobTitleId == orderDirectionStep.JobTitleId).OrderBy(e => e.SystemOrders.Count(so => so.OrderStatusId == 2)).FirstOrDefault();
                var newStep = new SystemOrderSteps();
                int stepcount = GetSystemOrderByIdAsync(systemOrderId).Result.SystemOrderSteps.Count+1;
               
                
                if (employee != null)
                {
                    timeline.EmployeeeOrderDetails += employee.FirstName + " " + employee.LastName + "assigned to step:" + orderDirectionStep.StateDescription+".";
                    assignedEmployees.Add(employee);
                    newStep.Employee = employee;
                    newStep.SystemOrderId=systemOrderId;
                    if (stepcount == 1)
                    {
                        newStep.IsCurrentStep = true;
                    }
                    if (tooLate)
                    {

                    }
                    else 
                    {

                        if (stepcount == 1)
                        {
                            newStep.StartDateForStep = DateTime.Now;
                            newStep.DueDateForStep = GetSystemOrderByIdAsync(systemOrderId).Result.DueDate.AddDays((-1 * estimatedDays) + estimatedDays * (double)orderDirectionStep.Ratio - 1);
                        }
                        else
                        {
                            newStep.StartDateForStep = GetSystemOrderByIdAsync(systemOrderId).Result.SystemOrderSteps.ToList()[stepcount - 2].DueDateForStep;
                            if (GetSystemOrderByIdAsync(systemOrderId).Result.SystemOrderSteps.ToList()[stepcount - 2].DueDateForStep.HasValue)
                            {
                                newStep.DueDateForStep = GetSystemOrderByIdAsync(systemOrderId).Result.SystemOrderSteps.ToList()[stepcount - 2].DueDateForStep.Value.AddDays(estimatedDays * (double)orderDirectionStep.Ratio);
                            }
                        }
                    }
                   
                    newStep.Description = orderDirectionStep.StateDescription;
                    newStep.EmployeeId=employee.EmployeeId;
                    newStep.SystemOrderId=systemOrderId;
                    systemorder.SystemOrderSteps.Add(newStep);
                    employee.SystemOrderSteps.Add(newStep);
                }
                else
                {
                    throw new Exception("No employees found for " + orderDirectionStep.StateDescription);

                }
            }

            return assignedEmployees;
        }

        public async Task<OrderWorkflowTimeline> GetOrdertimeFlowBySystemOrderId(string systemOrderId)
        {
            IQueryable<OrderWorkflowTimeline> query = _appDbContext.OrderWorkflowTimelines.Where(o=>o.SystemOrderId== systemOrderId);
            return await query.FirstOrDefaultAsync();
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
        public async Task<List<SystemOrder>> GetPendingSystemOrders()
        {
            IQueryable<SystemOrder> pendingOrders = _appDbContext.SystemOrders.Where(o => o.OrderStatusId == 1);
            return await pendingOrders.ToListAsync();
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
        public async Task<SystemOrder> GetSystemOrderByWorkflowId(int workflowtimelineId)
        {
            IQueryable<SystemOrder> query = _appDbContext.SystemOrders.Where(o=>o.OrderWorkflowTimelineId== workflowtimelineId);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<List<SystemOrder>> GetFinishedSystemWithoutDeliveriesOrders()
        {
            IQueryable<SystemOrder> query = _appDbContext.SystemOrders.Where(o => o.OrderStatusId == 3).Include(o=>o.Deliveries).Where(o=>o.Deliveries==null);
            return await query.ToListAsync();
        }
        public async Task<List<SystemOrder>> GetOrdersInProgressAndNoTimeline()
        {
            IQueryable<SystemOrder> query = _appDbContext.SystemOrders.Where(c => c.OrderStatusId==2).Include(o=>o.OrderWorkflowTimeline).Where(ow=>ow.OrderWorkflowTimeline.TimelineId==null);
            return await query.ToListAsync();
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
        public async Task<IEnumerable<SelectedArea>> GetSelectedAreasAsync()
        {
            return await _appDbContext.SelectedAreas.ToListAsync();
        }
        public async Task<IEnumerable<TeethShade>> GetAllTeethShadesAsync()
        {
            return await _appDbContext.TeethShades.ToListAsync();
        }

        public async Task<IEnumerable<SystemOrder>> GetAllSystemOrdersAsync()
        {
            return await _appDbContext.SystemOrders.ToListAsync();
        }
        public async Task<SystemOrderViewModel> GetAllSystemOrdersInformationAsync(string orderId)
        {
            SystemOrderViewModel orderinformation=new SystemOrderViewModel();
            orderinformation.systemOrder = GetSystemOrderByIdAsync(orderId).Result;
            orderinformation.Dentist = GetDentistdByIdAsync(orderinformation.systemOrder.DentistId).Result;
            orderinformation.Timeline=GetOrderTimelineByIdAsync(orderinformation.systemOrder.OrderWorkflowTimelineId).Result;
            orderinformation.patient=GetPatientByMedicalAidNumber(orderinformation.systemOrder.PatientMedicalAidNumber).Result;
            orderinformation.OrderStatus=GetOrderStatusByIdAsync(orderinformation.systemOrder.OrderStatusId).Result;
            orderinformation.OrderType = GetOrderTypeByIdAsync(orderinformation.systemOrder.OrderTypeId).Result;
            orderinformation.orderDirection=GetOrderDirectionById(orderinformation.Timeline.OrderDirectionId).Result;
            foreach(TeethShade teethShades in orderinformation.systemOrder.TeethShades)
            {
                orderinformation.Teethshades.Add(teethShades);
            }
            foreach (SelectedArea selectedArea in orderinformation.systemOrder.SelectedAreas)
            {
                orderinformation.SelectedAreas.Add(selectedArea);
            }



            return orderinformation;
        }
        public async Task<IEnumerable<Dentist>> GetDentistsAsync()
        {
            return await _appDbContext.Dentists.ToListAsync();
        }
        public async Task<Dentist> GetDentistdByIdAsync(int dentistId)
        {
            return await _appDbContext.Dentists.FirstOrDefaultAsync(o => o.DentistId == dentistId);
        }

        public async Task<IEnumerable<MedicalAid>> GetMedicalAidsAsync()
        {
            return await _appDbContext.MedicalAids.ToListAsync();
        }
        public async Task<MedicalAid> GetMedicalAidByIdAsync(int medicalAidId)
        {
            return await _appDbContext.MedicalAids.FirstOrDefaultAsync(o => o.MedicalAidId == medicalAidId);
        }


        public async Task<IEnumerable<OrderDirection>> GetOrderDirectionsAsync()
        {
            return await _appDbContext.OrderDirections.ToListAsync();
        }

        public async Task<SystemOrder> GetSystemOrderByIdAsync(string orderId)
        {
            return await _appDbContext.SystemOrders.Include(s=>s.TeethShades).Include(s=>s.SelectedAreas).Include(s=>s.SystemOrderSteps).Include(s=>s.OrderWorkflowTimeline).FirstOrDefaultAsync(o => o.OrderId == orderId);
        }
        public async Task<OrderDirection> GetOrderDirectionById(int orderDirectionId)
        {
            return await _appDbContext.OrderDirections.FirstOrDefaultAsync(o => o.OrderDirectionId == orderDirectionId);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _appDbContext.SaveChangesAsync() > 0;
        }

        public async Task<List<OrderType>> GetOrderTypesAsync()
        {
            return await _appDbContext.OrderTypes.ToListAsync();
        }
        public async Task<OrderType> GetOrderTypeByIdAsync(int ordertypeId)
        {
            return await _appDbContext.OrderTypes.Where(o=>o.OrderTypeId== ordertypeId).FirstOrDefaultAsync();
        }
        public async Task<List<OrderStatus>> GetOrderStatusesAsync()
        {
            return await _appDbContext.OrderStatuses.ToListAsync();
        }
        public async Task<OrderStatus> GetOrderStatusByIdAsync(int orderStatusId)
        {
            return await _appDbContext.OrderStatuses.Where(o => o.OrderStatusId == orderStatusId).FirstOrDefaultAsync();
        }
        public async Task<OrderWorkflowTimeline> GetOrderTimelineByIdAsync(int orderTimelinId)
        {
            return await _appDbContext.OrderWorkflowTimelines.Where(o => o.WorkflowStructureId == orderTimelinId).FirstOrDefaultAsync();
        }
        //emily
        //Employee
        public async Task<Employee[]> GetAllEmployeeAsync()
        {
            IQueryable<Employee> query = _appDbContext.Employees;
            return await query.ToArrayAsync();
        }
        public async Task<JobTitle> GetJobTitleByIdAsync(int id)
        {
            return await _appDbContext.JobTitles.FindAsync(id);
        }
        public async Task<List<JobTitle>> GetJobTitlesAsync()
        {
            return await _appDbContext.JobTitles.ToListAsync();
        }
        public async Task<Employee> GetEmployeeByIdAsync(int id)
        {
            return await _appDbContext.Employees.FindAsync(id);
        }
        public async Task<Employee> GetEmployeeByEmailAsync(string email)
        {

            IQueryable<Employee> query = _appDbContext.Employees.Where(e => e.Email == email);
            return await query.FirstOrDefaultAsync();
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

        public async Task CaptureEmployeeDailyHoursAsync(int employeeId, EmployeeDailyHours newDailyHours)
        {
            var employee = await _appDbContext.Employees.FindAsync(employeeId);
            if (employee == null)
            {
                throw new KeyNotFoundException($"No employee found with ID: {employeeId}");
            }

            newDailyHours.Employees.Add(employee);
            employee.EmployeeDailyHours.Add(newDailyHours);

            await _appDbContext.SaveChangesAsync();
        }

        public async Task<List<Delivery>> GetDeliveries()
        {
          
            return await _appDbContext.Deliveries.Include(d=>d.DeliveryStatus).Include(e=>e.Employee).ToListAsync(); 
        }
    }
}
