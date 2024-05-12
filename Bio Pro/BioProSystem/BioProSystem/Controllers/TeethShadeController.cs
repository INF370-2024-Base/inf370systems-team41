using BioProSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BioProSystem.Controllers
{
    public class TeethShadeController : Controller
    {
        private readonly IRepository _repository;
        public IActionResult Index()
        {
            return View();
        }


        
        // GET: api/teethshade/colors
        [HttpGet("colors")]
        public async Task<ActionResult<IEnumerable<TeethShade>>> GetTeethShadeColors()
        {
            try
            {
                // Retrieve all teeth shades from the repository asynchronously
                var teethShades = await _repository.GetAllTeethShadesAsync();

                // Check if any teeth shades were found
                if (teethShades == null || !teethShades.Any())
                {
                    return NotFound("No teeth shades found");
                }

                // Return the list of teeth shades as JSON response
                return Ok(teethShades);
            }
            catch (Exception ex)
            {
                // Handle and log any exceptions that occur during the operation
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}

