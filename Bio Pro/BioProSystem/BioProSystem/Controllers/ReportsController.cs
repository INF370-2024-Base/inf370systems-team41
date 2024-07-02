using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using BioProSystem.Models;
using BioProSystem.ViewModels;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;


namespace BioProSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : Controller
    {
        private readonly IRepository _repository;

        public ReportsController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetAllOrdersAsync()
        {
            try
            {
                var result = await _repository.GetAllSystemOrdersAsync();

                if (result == null)
                    return NotFound("No order found");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("StockTypesCountByCategory")]
        public async Task<IActionResult> StockTypesCountByCategory()
        {
            try
            {
                var stockTypes = await _repository.GetStockTypesCountByCategory();
                if (stockTypes.Count > 0)
                {
                    return Ok(stockTypes);
                }
                else
                {
                    return NotFound("No stock types found for any category");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please contact support. " + ex.Message);
            }
        }

        // Endpoint to get total amount of stock items within a stock category
        [HttpGet("StockItemsCountByCategory")]
        public async Task<IActionResult> StockItemsCountByCategory()
        {
            try
            {
                var stockCategories = await _repository.GetStockItemsCountByCategory();
                if (stockCategories.Count > 0)
                {
                    return Ok(stockCategories);
                }
                else
                {
                    return NotFound("No stock items found for any category");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error. Please contact support. " + ex.Message);
            }
        }




        [HttpGet]
        [Route("GetEmployeesWithMonthlyHours")]
        public async Task<IActionResult> GetEmployeesWithMonthlyHours()
        {
            var result = await _repository.GetEmployeesWithMonthlyHours();
            if (result != null)
            { return Ok(result); }
            else
            {
                return NotFound("No Jobtitiles found");
            }



        }

        [HttpGet]
        [Route("GetEmployeesWithWeeklyHours")]
        public async Task<IActionResult> GetEmployeesWithWeeklyHours()
        {
            var result = await _repository.GetEmployeesWithWeeklyHours();
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return NotFound("No Jobtitles found");
            }
        }



        [HttpGet("ordertypes/with-order-count")]
        public async Task<IActionResult> GetOrderTypesWithOrderCount()
        {
            try
            {
                var orderTypesWithCounts = await _repository.GetOrderTypesWithOrderCountAsync();
                return Ok(orderTypesWithCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("GetAllStockWriteOffs")]
        public async Task<IActionResult> GetAllStockWriteOffs()
        {
            try
            {
                var stockWriteOffs = await _repository.GetAllStockWriteOffsAsync();
                if (stockWriteOffs == null || !stockWriteOffs.Any())
                {
                    return NotFound("No stock write-offs found.");
                }

                return Ok(stockWriteOffs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}
