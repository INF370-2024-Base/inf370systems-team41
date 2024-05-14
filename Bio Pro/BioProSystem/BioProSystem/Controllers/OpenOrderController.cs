using BioProSystem.Models;
using BioProSystem.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using System.Reflection.Metadata.Ecma335;

namespace BioProSystem.Controllers
{

    public class OpenOrderController : Controller
    {
        private readonly UserManager<SystemUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<SystemUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;

        public OpenOrderController(UserManager<SystemUser> userManager, RoleManager<IdentityRole> roleManager, IUserClaimsPrincipalFactory<SystemUser> claimsPrincipalFactory, IConfiguration configuration, IRepository repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _repository = repository;
        }

        [HttpGet]
        [Route("GetAllOpenOrders")]
        //[Authorize(AuthenticationSchemes = "Bearer")]
        //[Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> GetAllOpenOrders()
        { 
            try
            {
                var results = await _repository.GetAllOpenOrdersAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpGet]
        [Route("GetOpenOrder/{OpenOrderID}")]
        public async Task<IActionResult> GetOpenOrderAsync(int OpenOrderID)
        {
            try
            {
                var result = await _repository.GetOpenOrdersAsync(OpenOrderID);

                if (result == null) return NotFound("Customer does not exist");

                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }
        
    }
}
