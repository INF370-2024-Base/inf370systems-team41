﻿using BioProSystem.Models;
using BioProSystem.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
        public async Task<List<Employee>> AssignAvailableTechnicians(int orderDirectionId, string systemOrderId)
        {
            var availableEmployees = await _appDbContext.Employees
                .Where(e => e.SystemOrders.Count(so => so.OrderStatusId == 2) < 3)
                .ToListAsync();

            var orderDirectionSteps = await _appDbContext.OrderDirectionStates
                .Where(o => o.OrderDirectionsId == orderDirectionId)
                .ToListAsync();
            if (orderDirectionSteps.Count == 0)
            {
                throw new Exception("No orderdirection steps found");
            }
            OrderWorkflowTimeline timeline = await GetOrdertimeFlowBySystemOrderId(systemOrderId);
            var assignedEmployees = new List<Employee>();
            var systemOrder = await GetSystemOrderByIdAsync(systemOrderId);
            bool tooLate = false;

            int estimatedDays = (await GetOrderDirectionById(orderDirectionId)).EstimatedDurationInDays;
            if (systemOrder.DueDate.AddDays(-1 * estimatedDays) < DateTime.Now)
            {
                tooLate = true;
            }

            foreach (var orderDirectionStep in orderDirectionSteps)
            {
                var employee = availableEmployees
                    .Where(e => e.JobTitleId == orderDirectionStep.JobTitleId)
                    .OrderBy(e => e.SystemOrders.Count(so => so.OrderStatusId == 2))
                    .FirstOrDefault();

                var newStep = new SystemOrderSteps();
                int stepcount = (await GetSystemOrderByIdAsync(systemOrderId)).SystemOrderSteps.Count + 1;

                if (employee != null)
                {
                    

                    if (stepcount == 1)
                    {
                        newStep.IsCurrentStep = true;
                    }
                    if(orderDirectionStep==orderDirectionSteps.Last())
                    {
                        newStep.IsFinalStep = true;
                    }

                    if (!tooLate)
                    {
                        if (stepcount == 1)
                        {
                            newStep.StartDateForStep = DateTime.Now;
                            newStep.DueDateForStep = systemOrder.DueDate.AddDays((-1 * estimatedDays) + estimatedDays * (double)orderDirectionStep.Ratio - 1);
                        }
                        else
                        {
                            var previousStep = (await GetSystemOrderByIdAsync(systemOrderId)).SystemOrderSteps.ElementAtOrDefault(stepcount - 2);
                            if (previousStep != null)
                            {
                                newStep.StartDateForStep = previousStep.DueDateForStep;
                                newStep.DueDateForStep = previousStep.DueDateForStep?.AddDays(estimatedDays * (double)orderDirectionStep.Ratio);
                            }
                        }
                    }
                    timeline.EmployeeeOrderDetails += $"{employee.FirstName} {employee.LastName} assigned to step: {orderDirectionStep.StateDescription}.";
                    assignedEmployees.Add(employee);
                    newStep.Employee = employee;
                    newStep.SystemOrderId = systemOrderId;

                    newStep.Description = orderDirectionStep.StateDescription;
                    newStep.EmployeeId = employee.EmployeeId;
                    newStep.SystemOrderId = systemOrderId;

                    _appDbContext.Add(newStep);
                    systemOrder.SystemOrderSteps.Add(newStep);
                    employee.SystemOrderSteps.Add(newStep);
                }
                else
                {
                    JobTitle jobNeeded = await GetJobTitleByIdAsync(orderDirectionStep.JobTitleId);
                    throw new Exception($"No employees found for {orderDirectionStep.StateDescription}. Employee with Job title: {jobNeeded.TitleName} needed.");
                }
            }

            await _appDbContext.SaveChangesAsync(); // Save changes to the database

            return assignedEmployees;
        }


        public async Task<OrderWorkflowTimeline> GetOrdertimeFlowBySystemOrderId(string systemOrderId)
        {
            IQueryable<OrderWorkflowTimeline> query = _appDbContext.OrderWorkflowTimelines.Where(o => o.SystemOrderId == systemOrderId).Include(o=>o.systemOrder);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<OpenOrder> GetOpenOrdersAsync(int openOrderID)
        {
            IQueryable<OpenOrder> query = _appDbContext.OpenOrders.Where(c => c.OpenOrderId == openOrderID);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<List<Employee>> GetEmployeesWithJobTitleId(int jobTitileId,string jobTitleName="")
        {
            if(jobTitleName == "")
            {
                List<Employee> query = await _appDbContext.Employees.Where(c => c.JobTitleId == jobTitileId).ToListAsync();
                return query;
            }
            else
            {
                JobTitle jobtitle = await _appDbContext.JobTitles.Where(j => j.TitleName == jobTitleName).FirstOrDefaultAsync();
                List<Employee> query = await _appDbContext.Employees.Where(c => c.JobTitleId== jobtitle.JobTitleId).ToListAsync();
                return query;
            }
           
            
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
        public async Task<List<SystemOrder>> GetSystemOrdersWithOrderStatusID(int orderStatusId)
        {
            IQueryable<SystemOrder> pendingOrders = _appDbContext.SystemOrders.Where(o => o.OrderStatusId == orderStatusId).Include(s=>s.OrderStatus).Include(s=>s.OrderWorkflowTimeline).ThenInclude(o=>o.orderDirection).Include(s=>s.Dentist).Include(s=>s.OrderType).Include(o=>o.MediaFiles);
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
            IQueryable<SystemOrder> query = _appDbContext.SystemOrders.Where(o => o.OrderWorkflowTimelineId == workflowtimelineId);
            return await query.FirstOrDefaultAsync();
        }
        public async Task<List<SystemOrder>> GetOrdersAwaitingDentalDesign()
        {
            IQueryable<SystemOrder> query = _appDbContext.SystemOrders.Where(o => o.OrderStatusId == 2).Include(s=>s.MediaFiles).Include(s=>s.Dentist);
            return await query.ToListAsync();
        }
        public async Task<List<SystemOrder>> GetFinishedSystemWithoutDeliveriesOrders()
        {
            IQueryable<SystemOrder> query = _appDbContext.SystemOrders.Where(o => o.OrderStatusId == 5).Include(o => o.Deliveries).Where(o => o.Deliveries.Count < 1);
            return await query.ToListAsync();
        }
        public async Task<List<SystemOrder>> GetOrdersInProgressAndNoTimeline()
        {
            IQueryable<SystemOrder> query = _appDbContext.SystemOrders.Where(c => c.OrderStatusId == 4).Include(o => o.OrderWorkflowTimeline).Where(ow => ow.OrderWorkflowTimeline.TimelineId == null);
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
            IQueryable<Patient> query = _appDbContext.Patients.Where(p => p.MedicalAidNumber == medicalAidNumber);
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
        public async Task<List<SystemOrderSteps>> GetAllSystemOrderStepsAsync(string orderId)
        {
            return await _appDbContext.SystemOrderSteps.Where(sos => sos.SystemOrderId == orderId).Include(sos => sos.Employee).ToListAsync();
        }
        public async Task<SystemOrderViewModel> GetAllSystemOrdersInformationAsync(string orderId)
        {
            SystemOrderViewModel orderinformation = new SystemOrderViewModel();
            orderinformation.systemOrder = GetSystemOrderByIdAsync(orderId).Result;
            orderinformation.Dentist = GetDentistdByIdAsync(orderinformation.systemOrder.DentistId).Result;
            orderinformation.Timeline = GetOrderTimelineByIdAsync(orderinformation.systemOrder.OrderWorkflowTimelineId).Result;
            orderinformation.patient = GetPatientByMedicalAidNumber(orderinformation.systemOrder.PatientMedicalAidNumber).Result;
            orderinformation.OrderStatus = GetOrderStatusByIdAsync(orderinformation.systemOrder.OrderStatusId).Result;
            orderinformation.OrderType = GetOrderTypeByIdAsync(orderinformation.systemOrder.OrderTypeId).Result;
            orderinformation.orderDirection = GetOrderDirectionById(orderinformation.Timeline.OrderDirectionId).Result;
            if (orderinformation.systemOrder.SystemOrderSteps.Any())
            {
                orderinformation.SystemOrderSteps = await GetAllSystemOrderStepsAsync(orderId);
            }
            foreach (TeethShade teethShades in orderinformation.systemOrder.TeethShades)
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
        public async Task<MedicalAid> GetOrderWorkFlow(int medicalAidId)
        {
            return await _appDbContext.MedicalAids.FirstOrDefaultAsync(o => o.MedicalAidId == medicalAidId);
        }


        public async Task<IEnumerable<OrderDirection>> GetOrderDirectionsAsync()
        {
            return await _appDbContext.OrderDirections.ToListAsync();
        }

        public async Task<SystemOrder> GetSystemOrderByIdAsync(string orderId)
        {
            return await _appDbContext.SystemOrders.Include(s => s.TeethShades).Include(s => s.SelectedAreas).Include(s => s.SystemOrderSteps).Include(s => s.OrderWorkflowTimeline).Include(s => s.SystemOrderSteps).Include(s => s.MediaFiles).Include(o=>o.StockItems).ThenInclude(s=>s.Stock).FirstOrDefaultAsync(o => o.OrderId == orderId);
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
            return await _appDbContext.OrderTypes.Where(o => o.OrderTypeId == ordertypeId).FirstOrDefaultAsync();
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
            IQueryable<Employee> query = _appDbContext.Employees.Where(e => e.isActiveEmployee);
            return await query.ToArrayAsync();
        }
        public async Task<SystemOrder[]> GetSystemOrdersForEmployee(string employeeEmail)
        {
            IQueryable<SystemOrder> query = _appDbContext.SystemOrders.Include(o=>o.Employees).Where(o=>o.OrderStatusId==4 && o.Employees.Any(e=>e.Email==employeeEmail)).Include(o=>o.SystemOrderSteps).ThenInclude(step=>step.Employee);
            return await query.ToArrayAsync();
        }
        public async Task<SystemOrderSteps> GetSystemOrderStepById(int stepId)
        {
            SystemOrderSteps query = await _appDbContext.SystemOrderSteps.Where(s=>s.SysteorderStepId==stepId).FirstOrDefaultAsync();
            return query;
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
            IQueryable<Dentist> query = _appDbContext.Dentists.Where(d => d.DentistId == dentistId).Include(d => d.SystemOrders).Include(s => s.Patients);
            return await query.FirstOrDefaultAsync();
        }

        public void AddDentist(Dentist dentist)
        {
            _appDbContext.Dentists.Add(dentist);
        }
        public void AddStockItem(StockItem stockItem)
        {
            _appDbContext.StockItems.Add(stockItem);
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
        public async Task<MediaFile> GetImageDataFromId(int imageID)
        {
            return _appDbContext.MediaFiles.Where(i => i.MediaFileId == imageID).FirstOrDefault();
        }
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

            return await _appDbContext.Deliveries.Include(d => d.DeliveryStatus).Include(e => e.Employee).ToListAsync();
        }
        public async Task<List<CalanderScheduleEvent>> GetAllScheduledEvents()
        {
            return await _appDbContext.CalanderScheduleEvents.Include(c=>c.Calander).ToListAsync();
        } 
        public async Task<List<Calander>> GetAllCalendar()
        {
            return await _appDbContext.Calanders.Include(c=>c.Timeline).Include(c => c.Events).ToListAsync();
        }
        public async Task<List<ProceduralTimeline>> GetAllProceduralTimelinesAsync()
        {
            List<ProceduralTimeline> proceduralTimelines = await _appDbContext.ProceduralTimelines.Include(t=>t.OrderWorkflowTimeline).ThenInclude(ow=>ow.systemOrder).OrderByDescending(t => t.TimeStamp).ToListAsync();
            return proceduralTimelines;
        }
        public async Task<CalanderScheduleEvent> GetScheduledEventById(int id)
        {
            return await _appDbContext.CalanderScheduleEvents.Where(c => c.CalanderScheduleEventId==id).FirstOrDefaultAsync();
        }
        public async Task<EmployeeDailyHours> GetEmployeeDailyHoursById(int employeedDailyHoursId)
        {

            return await _appDbContext.EmployeeDailyHours.Where(edh => edh.EmployeeDailyHoursId == employeedDailyHoursId).FirstOrDefaultAsync();
        }
        public async Task<List<EmployeeDailyHours>> GetEmployeeDailyHours()
        {

            return await _appDbContext.EmployeeDailyHours.Include(emp => emp.Employees).ToListAsync();
        }
        public async Task<MediaFile> GetMediaFileById(int mediaFileId)
        {
            return await _appDbContext.MediaFiles.Where(m => m.MediaFileId == mediaFileId).FirstOrDefaultAsync();
        }
        //stock
        public async Task<List<Stock>> GetAllStocks()
        {
            return await _appDbContext.Stocks.Include(s => s.Supplier).Include(s => s.StockCategory).ToListAsync();
        }
        public async Task<List<StockType>> GetAllStockTypes()
        {
            return await _appDbContext.StockType.Include(s => s.StockCategories).ToListAsync();
        }
        public async Task<Stock> GeStockById(int id)
        {
            return await _appDbContext.Stocks.Where(s => s.StockId==id).FirstOrDefaultAsync();
        }
        public async Task<List<StockCategory>> GetAllStockCategories()
        {
            return await _appDbContext.StockCategories.Include(s => s.StockType).ToListAsync();
        }
        public async Task<List<Supplier>> GetAllSupplier()
        {
            return await _appDbContext.Suppliers.ToListAsync();
        }
        public async Task<StockCategory> GetStockCategoryById(int stockCategoryId)
        {
            return await _appDbContext.StockCategories.Where(sc => sc.StockCategoryId == stockCategoryId).FirstOrDefaultAsync();
        }
        public async Task<Stock> GetStockById(int stockId)
        {
            return await _appDbContext.Stocks.Where(sc => sc.StockId == stockId).FirstOrDefaultAsync();
        }
        public async Task<StockType> GetStockTypeById(int stockTypeId)
        {
            return await _appDbContext.StockType.Where(sc => sc.StockTypeId == stockTypeId).FirstOrDefaultAsync();
        }
        public async Task<List<SystemUser>> GetAllSystemUserActiveAsync()
        {
            return await _appDbContext.SystemUsers.Where(su => su.LockoutEnd < DateTime.Now || su.LockoutEnd == null).ToListAsync();
        }

        public async Task<List<EmployeeDailyHours>> GetEmployeeDailyHoursByDay(DateTime dateTime)
        {
            return await _appDbContext.EmployeeDailyHours.Where(edh=>edh.WorkDate.Date== dateTime.Date).Include(edh=>edh.Employees).ToListAsync();
        }
        public async Task<List<EmployeeDailyHours>> GetEmployeeDailyByEmployee(string employeeEmail)
        {
            return await _appDbContext.EmployeeDailyHours
                .Include(edh => edh.Employees)
                .Where(edh => edh.Employees.Any(emp => emp.Email == employeeEmail))
                .ToListAsync();
        }

    }
}
