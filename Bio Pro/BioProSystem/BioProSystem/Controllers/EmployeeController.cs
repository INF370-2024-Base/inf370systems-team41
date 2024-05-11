using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BioProSystem.Models;
using BioProSystem.ViewModels;

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

        // POST api/Employee/AddEmployee
        [HttpPost("AddEmployee")]
        public async Task<IActionResult> AddEmployee(EmployeeViewModel model)
        {
            try
            {
                // Find or create the JobTitle entity for the role
                var jobTitle = await _repository.GetJobTitleByIdAsync((int)model.JobTitleId);
                if (jobTitle == null) return BadRequest("JobTitle not found.");

                // Create a new Employee entity
                var employee = new Employee
                {
                    UserId = model.UserId,
                    JobTitleId = model.JobTitleId,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    CellphoneNumber = model.CellphoneNumber,
                    Email = model.Email,
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
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
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
    }
}