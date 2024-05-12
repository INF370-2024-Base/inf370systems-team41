﻿using Microsoft.AspNetCore.Mvc;
using BioProSystem.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BioProSystem.ViewModels;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json; 

namespace BioProSystem.Controllers
{
    public class OrderController : Controller
    {
        private readonly UserManager<SystemUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IRepository _repository;
        private readonly IUserClaimsPrincipalFactory<SystemUser> _claimsPrincipalFactory;
        private readonly IConfiguration _configuration;


        public OrderController(UserManager<SystemUser> userManager, RoleManager<IdentityRole> roleManager, IUserClaimsPrincipalFactory<SystemUser> claimsPrincipalFactory, IConfiguration configuration, IRepository repository)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _claimsPrincipalFactory = claimsPrincipalFactory;
            _configuration = configuration;
            _repository = repository;
        }


        public IActionResult Index()
        {
            return View();
        }


        // POST: /Order/Add
        [HttpPost]
        [Route("AddOrders")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        [Authorize(Roles = "Admin, Manager")]
        public async Task<IActionResult> Add(SystemOrderViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    //ADD the TEETHSHADING !!!!!!!!!
                    var selectedMouthArea = JsonConvert.DeserializeObject<SelectedArea>(viewModel.SelectedMouthArea);

                    var newOrder = new SystemOrder
                    {
                        OrderId = viewModel.OrderId,//dropdown
                        DentistId = viewModel.DentistId,//dropdown or small search pop-up
                        OrderDate = viewModel.OrderDate,//calendar select
                        PatientName = viewModel.PatientName,//enter
                        PatientSurname = viewModel.PatientSurname,//enter
                        MedicalAidId = viewModel.MedicalAidId,//dropdown or small search pop-up
                        MedicalAidNumber = viewModel.MedicalAidNumber,//enter
                        OrderDirectionId = viewModel.OrderDirectionId,//dropdown
                        MouthArea = selectedMouthArea,
                        EmergencyNumber = viewModel.EmergencyNumber,
                        SpecialRequirements = viewModel.SpecialRequirements,
                        PriorityLevel = viewModel.PriorityLevel,
                        DueDate = viewModel.DueDate
                    };
                    newOrder.Employees.Add()
                    _repository.Add(newOrder);

                    if (await _repository.SaveChangesAsync())
                    {
                        return Ok(newOrder);
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Failed to save changes.");
                        return BadRequest(ModelState);
                    }
                }
                catch (Exception ex)
                {
                    ModelState.AddModelError(string.Empty, $"An error occurred: {ex.Message}");
                    return BadRequest(ModelState);
                }
            }
            else
            {
                return BadRequest(ModelState);
            }
        }

        

        [HttpGet("api/medicalaids")]
        public async Task<IActionResult> GetMedicalAids()
        {
            try
            {
                var medicalAids = await _repository.GetMedicalAidsAsync(); // Await the asynchronous method
                return Ok(medicalAids); // Return list of medical aids as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("api/dentists")]
        public async Task<IActionResult> GetDentists()
        {
            try
            {
                var dentists = await _repository.GetDentistsAsync(); // Await the asynchronous method
                return Ok(dentists); // Return list of dentists as JSON response
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("GetAllOrders/{OrderId}")]
        public async Task<IActionResult> GetAllSystemOrdersAsync(string OrderId)
        {
            try
            {
                var result = await _repository.GetSystemOrderByIdAsync(OrderId);

                if (result == null)
                    return NotFound("No order found");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

        [HttpGet("Create")]
        public async Task<IActionResult> Create()
        {
            var viewModel = new SystemOrderViewModel();

            try
            {
                // Populate dropdown lists asynchronously
                viewModel.Dentists = new SelectList(await _repository.GetDentistsAsync(), "DentistId", "FullName");
                viewModel.MedicalAids = new SelectList(await _repository.GetMedicalAidsAsync(), "MedicalAidId", "Name");
                viewModel.OrderDirections = new SelectList(await _repository.GetOrderDirectionsAsync(), "OrderDirectionId", "Name");

                return View(viewModel);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

    }
}
