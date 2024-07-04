using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BioProSystem.Models;
using BioProSystem.ViewModels;
using System.Text.RegularExpressions;
using BioProSystem.EmailService;
using System.Net;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using System.Net.Mail;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BioProSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IRepository _repository;
        private readonly IEmailSender _emailSender;
        private readonly EmailSettings _emailSettings;
        public EmployeeController(IRepository repository, IOptions<EmailSettings> emailSettings, IEmailSender emailSender)
        {
            _repository = repository;
            _emailSender = emailSender;
            _emailSettings = emailSettings.Value;
        }

        [HttpGet]
        [Route("GetAllEmployee")]
        public async Task<IActionResult> GetAllEmployee()
        {
            try
            {
                var employee = await _repository.GetAllEmployeeAsync();
                return Ok(employee);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        // POST api/Employee/AddEmployee
        [HttpPost("AddEmployee")]
        public async Task<IActionResult> AddEmployee(SystemEmployeeAddViewModel model)
        {
            try
            {
               var jobTitle = await _repository.GetJobTitleByIdAsync((int)model.JobTitleId);
                if (jobTitle == null) return BadRequest("JobTitle not found.");
                var systemUser = _repository.GetsystemUserAsync(model.EmailAddress).Result;
                if (systemUser == null) return BadRequest("Create User First");
                var checkEmployee = _repository.GetEmployeeByEmailAsync(model.EmailAddress).Result;
                if (checkEmployee != null)
                {
                    return BadRequest("Employee already exists");
                }  // Find or create the JobTitle entity for the role
               
                // Create a new Employee entity
                var employee = new Employee
                {
                    SystemUserId = systemUser.Id,
                    JobTitleId = model.JobTitleId,
                    FirstName = systemUser.Name,
                    LastName = systemUser.Surname,
                    CellphoneNumber = model.PhoneNumber,
                    Email = systemUser.Email,
                    Address = model.Address,
                    JobTitle = jobTitle // Assign the JobTitle
                };

                // Add the new employee to the repository
                _repository.Add(employee);

                // Save changes
                if (await _repository.SaveChangesAsync())
                {
                    return Ok(employee);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message+"Internal Server Error. Please contact support.");
            }

            return BadRequest("Failed to add employee.");
        }

        // PUT api/Employee/EditEmployee
        [HttpPut("EditEmployee")]
        public async Task<IActionResult> EditEmployee(EditEmployee employeeToEdit)
        {
            try
            {
                var employee = await _repository.GetEmployeeByIdAsync(employeeToEdit.EmployeeId);
                if (employee == null) return NotFound("Employee not found.");

                // Update employee details
                employee.JobTitleId= employeeToEdit.JobTitleId;
                employee.Address = employeeToEdit.Address;

                if (await _repository.SaveChangesAsync())
                {
                    return Ok(employee);
                }
                else
                {
                    return BadRequest("Failed to update employee.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }


        // DELETE api/Employee/DeleteEmployee/{id}
        [HttpDelete("DeleteEmployee/{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var employee = await _repository.GetEmployeeByIdAsync(id);
                if (employee == null) return NotFound("Employee not found.");
                if (!employee.isActiveEmployee)
                {
                    return BadRequest("Employee already removed");
                }
                // Delete the employee
                employee.isActiveEmployee = false;
                
                if (await _repository.SaveChangesAsync())
                {
                    return Ok(new { message = "Employee deleted successfully." });
                }
                else
                {
                   return BadRequest("Unable to save changes");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            return BadRequest("Failed to delete employee.");
        }

        // GET api/Employee/SearchEmployees
        [HttpGet("SearchEmployees")]
        public async Task<IActionResult> SearchEmployees([FromQuery] string searchString)
        {
            try
            {
                var employees = await _repository.GetAllEmployeesAsync();
                var filteredEmployees = employees.Where(e => e.FirstName.Contains(searchString) || e.LastName.Contains(searchString)).ToList();

                if (filteredEmployees.Count == 0) return NotFound("No employees found.");

                return Ok(filteredEmployees);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("capture-daily-hours/{employeeId}")]
        public async Task<IActionResult> CaptureEmployeeDailyHours(int employeeId, EmployeeDailyHoursViewModel newDailyHours)
        {
            try
            {
                EmployeeDailyHours employeeDailyHours= new EmployeeDailyHours { WorkDate = newDailyHours.WorkDate, Hours=newDailyHours.Hours };
                await _repository.CaptureEmployeeDailyHoursAsync(employeeId, employeeDailyHours);
                return Ok(newDailyHours);
            }
            catch (Exception ex)
            {
                // Log the exception or return a meaningful error message
                return StatusCode(500, "An error occurred while capturing daily hours.");
            }
        }
        [HttpDelete]
        [Route("DeleteEmployeeDailyHours/{employeedDailyHoursId}")]
        public async Task<IActionResult> DeleteEmployeeDailyHours(int employeedDailyHoursId)
        {
            try
            {
                EmployeeDailyHours employeeDailyHours = await _repository.GetEmployeeDailyHoursById(employeedDailyHoursId);
                if (employeeDailyHours == null) return NotFound("Id not found");
                _repository.Delete(employeeDailyHours);
                if(await _repository.SaveChangesAsync())
                {
                    return Ok(employeeDailyHours);
                }
                else
                {
                    return BadRequest("Could not save changes");
                }
                
            }
            catch (Exception ex)
            {
                // Log the exception or return a meaningful error message
                return StatusCode(500, "An error occurred while deleting daily hours."+ex.InnerException.Message);
            }
        }
        [HttpGet]
        [Route("GetEmployeeInfoByEmail/{employeeEmail}")]
        public async Task<ActionResult<Employee>> GetEmployeeInfoByEmail(string employeeEmail)
        {
            var result = await _repository.GetEmployeeByEmailAsync(employeeEmail);
            if (result != null)
            { return Ok(result); }
            else
            {
                return NotFound("No employee found");
            }
        }
        [HttpGet]
        [Route("GetEmployeeDailyHours")]
        public async Task<ActionResult<List<EmployeeDailyHours>>> GetEmployeeDailyHours()
        {
            var result = await _repository.GetEmployeeDailyHours();
            if (result != null)
            { return Ok(result); }
            else
            {
                return NotFound("No employee daily hours found");
            }
        }
        [HttpGet]
        [Route("GetEmployeeDailyHoursByDate")]
        public async Task<ActionResult<List<EmployeeDailyHours>>> GetEmployeeDailyHoursByDate(DateTime date)
        {
            var result = await _repository.GetEmployeeDailyHoursByDay(date);
            if (result != null)
            { return Ok(result); }
            else
            {
                return NotFound("No employee daily hours found on:"+ date.Date.ToShortDateString());
            }
        }
        [HttpGet]
        [Route("GetEmployeeDailyHoursByEmployee/{email}")]
        public async Task<ActionResult<List<EmployeeDailyHours>>> GetEmployeeDailyHoursByEmployee(string email)
        {
            Employee employee=await _repository.GetEmployeeByEmailAsync(email);
            List<EmployeeDailyHours> result = await _repository.GetEmployeeDailyByEmployee(email);
            if (result != null)
            { return Ok(result); }
            else
            {
                return NotFound("No employee daily hours found for:" + employee.FirstName+" "+employee.LastName); ;
            }
        }

        [HttpGet]
        [Route("getjobtitles")]
        public async Task<ActionResult<List<JobTitle>>> GetJobtitles()
        {
             var result = await _repository.GetJobTitlesAsync();
                if(result!=null)
                { return Ok(result); }
                else
                {
                    return NotFound("No Jobtitiles found");
                }
        }

        [HttpGet]
        [Route("GetCurrentOrders/{email}")]
        public async Task<ActionResult<List<SystemOrder>>> GetJobtitles(string email)
        {
            var result = await _repository.GetSystemOrdersForEmployee(email);
            
            if (result != null)
            { return Ok(result); }
            else
            {
                return NotFound("No Jobtitiles found");
            }
        }

        [HttpPut]
        [Route("CompleteStepAndJob/{stepId}")]
        public async Task<IActionResult> CompleteStepAndJob(int stepId)
        {
            SystemOrderSteps completedStep =await _repository.GetSystemOrderStepById(stepId);
            SystemOrderSteps nextStep = await _repository.GetSystemOrderStepById(stepId+1);
            
            if (completedStep != null)
            {
                SystemOrder order = await _repository.GetSystemOrderByIdAsync(completedStep.SystemOrderId);
                if (!completedStep.IsFinalStep)
                {
                    if (completedStep.IsCurrentStep)
                    {
                        completedStep.DateCompleted = DateTime.Now;
                        completedStep.IsCurrentStep = false;
                        nextStep.IsCurrentStep=true;
                    }
                }
                else
                {
                    completedStep.DateCompleted = DateTime.Now;
                    order.OrderStatusId = 5;
                    List<Employee> drivers=await _repository.GetEmployeesWithJobTitleId(0, "Driver");
                    foreach (Employee driver in drivers)
                    {
                        EmailViewModel emailViewModel = new EmailViewModel();
                        emailViewModel.Email = driver.Email;
                        emailViewModel.Emailheader = "New order to collect for delivery:"+order.OrderId+".";
                        emailViewModel.EmailContent = "There is a new order that neads to be collected for delivery. Please notify admin when you are available to pick up order";
                        SendTestEmail(emailViewModel);
                    }
                }
                if(await _repository.SaveChangesAsync())
                {
                    return Ok(order);
                }
                else
                {
                    return BadRequest("Unable to save changes. Please contact support.");
                }
            }
            else
            {
                return NotFound("Order not found.Please contact support.");
            }

        }
        [HttpHead]
        public async Task<IActionResult> SendTestEmail(EmailViewModel email)
        {
            var client = new SmtpClient(_emailSettings.SmtpServer, _emailSettings.SmtpPort)
            {
                Credentials = new NetworkCredential(_emailSettings.Username, _emailSettings.Password),
                EnableSsl = true
            };
            await _emailSender.SendEmailAsync(email.Email, email.Emailheader, email.EmailContent);
            return Ok("Email sent successfully");
        }
    }
}