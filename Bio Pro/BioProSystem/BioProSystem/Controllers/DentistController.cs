using BioProSystem.Models;
using BioProSystem.ViewModels;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BioProSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DentistController : ControllerBase
    {
        private readonly IRepository _repository;

        public DentistController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("GetAllDentists")]
        public async Task<IActionResult> GetAllDentists()
        {
            try
            {
                var dentists = await _repository.GetAllDentistsAsync();
                return Ok(dentists);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetDentist/{dentistId}")]
        public async Task<IActionResult> GetDentistAsync(int dentistId)
        {
            try
            {
                var dentist = await _repository.GetDentistAsync(dentistId);
                if (dentist == null) return NotFound("Dentist not found.");

                return Ok(dentist);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpPost]
        [Route("AddDentist")]
        public async Task<IActionResult> AddDentist(DentistViewModel model)
        {
            try
            {
                // Convert ViewModel to Model, ignoring Patients and SystemOrders
                var dentist = ConvertToDentistModel(model);
                _repository.AddDentist(dentist);
                await _repository.SaveChangesAsync();
                return Ok(dentist);
            }
            catch (Exception)
            {
                return BadRequest("Invalid transaction");
            }
        }

        [HttpPut]
        [Route("EditDentist/{dentistId}")]
        public async Task<IActionResult> EditDentist(int dentistId, DentistViewModel model)
        {
            try
            {
                // Convert ViewModel to Model, ignoring Patients and SystemOrders
                var dentist = ConvertToDentistModel(model);
                Dentist dentisttoEdit=_repository.GetDentistdByIdAsync(dentistId).Result;
                if (dentisttoEdit == null)
                    return NotFound("Dentist not found");
                dentisttoEdit.ContactDetail=model.ContactDetail;
                dentisttoEdit.FirstName=model.FirstName;
                dentisttoEdit.Address=model.Address;
                dentisttoEdit.LastName=model.LastName;
                if(await _repository.SaveChangesAsync())
                {
                    return Ok(dentist);
                }
                else
                {
                    return BadRequest("Could not save changes. Make sure an attribute was changed.");
                }
                
            }
            catch (Exception )
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("DeleteDentist/{dentistId}")]
        public async Task<IActionResult> DeleteDentist(int dentistId)
        {
            try
            {
                var dentist = await _repository.GetDentistAsync(dentistId);
                if (dentist == null) return NotFound("Dentist not found.");
                if(dentist.SystemOrders.Any())
                {
                    return BadRequest("Cannot delete dentist that has been used in a system order");
                }
                if(dentist.Patients.Any())
                {
                    return BadRequest("Cannot delete dentist that has been assigned patients");
                }
                _repository.Delete(dentist);
                await _repository.SaveChangesAsync();
                return Ok(new { message = "Dentist deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please contact support."+ex.InnerException.Message);
            }
        }

        // Helper method to convert ViewModel to Model, ignoring Patients and SystemOrders
        private Dentist ConvertToDentistModel(DentistViewModel viewModel)
        {
            return new Dentist
            {
                LastName = viewModel.LastName,
                FirstName = viewModel.FirstName,
                ContactDetail = viewModel.ContactDetail,
                Address = viewModel.Address
            };
        }
    }
}
