using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BioProSystem.Models;
using BioProSystem.ViewModels;
using System.Text.RegularExpressions;

namespace BioProSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IRepository _repository;

        public EmployeeController(IRepository repository)
        {
            _repository = repository;
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
        [HttpPut("EditEmployee/{id}")]
        public async Task<IActionResult> EditEmployee(int id, EmployeeViewModel model)
        {
            try
            {
                var employee = await _repository.GetEmployeeByIdAsync(id);
                if (employee == null) return NotFound("Employee not found.");

                // Update employee details
                employee.FirstName = model.FirstName;
                employee.LastName = model.LastName;
                employee.CellphoneNumber = model.CellphoneNumber;
                employee.Email = model.Email;
                employee.Address = model.Address;

                // Update the employee in the repository
                var updatedEmployee = await _repository.UpdateEmployeeAsync(employee);
                if (updatedEmployee != null)
                {
                    return Ok(updatedEmployee);
                }
                else
                {
                    return BadRequest("Failed to update employee.");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
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

                // Delete the employee
                if (await _repository.DeleteEmployeeAsync(employee))
                {
                    return Ok(new { message = "Employee deleted successfully." });
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

    }
}